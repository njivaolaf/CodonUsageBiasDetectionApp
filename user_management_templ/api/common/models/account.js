'use strict';

module.exports = function (Account) {
    var app = require('../../server/server');
    var BAD_PASSWORD_ATTEMPT = 3;

    Account.beforeRemote('**', function (ctx, unused, next) {
        if (ctx.methodString === 'Account.login') {
            var email = (ctx.args && ctx.args.credentials && ctx.args.credentials.email) || (ctx.req.body && ctx.req.body.email) || false;
            if (email) {
                Account.findOne({
                    where: { email: email }
                }, function (err, account) {
                    if (err || !account)
                        return next(err);
                    if (account.locked || account.badPasswordCount >= BAD_PASSWORD_ATTEMPT || !account.active) {
                        var error = new Error('Account Locked');
                        error.statusCode = 401;
                        error.name = 'Error';
                        error.code = 'ACCOUNT_LOCKED';
                        return next(error);
                    }
                    next();
                });
            } else {
                next();
            }
        } else if (ctx.methodString === 'Account.create' || ctx.methodString === 'Account.prototype.patchAttributes') {
            if (ctx.methodString === 'Account.create') {
                ctx.args.data['password'] = 'temp';
                ctx.args.data['active'] = true;
                ctx.args.data['locked'] = false;
            }
            if (ctx.methodString === 'Account.prototype.patchAttributes')
                delete ctx.args.data['email'];
            delete ctx.args.data['_active'];
            delete ctx.args.data['_locked'];
            next();
        } else if (ctx.methodString === 'Account.changePassword') {
            if (ctx.args && ctx.args.id) {
                Account.findOne({
                    where: { id: ctx.args.id }
                }, function (err, account) {
                    if (err || !account) return next(err);
                    if (account.locked || account.badPasswordCount >= BAD_PASSWORD_ATTEMPT || !account.active) {
                        var er = new Error('Account is locked.');
                        er.statusCode = 403;
                        er.name = 'Error';
                        er.code = 'ACCOUNT_LOCKED';
                        return next(er);
                    }
                    next();
                });
            } else {
                next();
            }
        } else {
            next();
        }
    });

    Account.afterRemote('**', function (ctx, model, next) {
        if (ctx.methodString === 'Account.login') {
            Account.findById(model.userId, function (err, account) {
                if (err || !account || account.badPasswordCount <= 0)
                    return next();
                account.updateAttribute('badPasswordCount', 0, function (e, instance) {
                    next();
                });
            });
        } else if (ctx.methodString === 'Account.findById') {
            if (ctx.result) {
                app.models.RoleMapping.findOne({
                    where: { principalId: ctx.result.id },
                    include: 'role'
                }, function (err, roleMapping) {
                    if (roleMapping) {
                        ctx.result['role'] = roleMapping.role().name;
                        ctx.result['isAdmin'] = roleMapping.role().name === 'admin';
                    }
                    next();
                });
            }
            else {
                next();
            }
        } else if (ctx.methodString === 'Account.create') {
            if (ctx.result) {
                generatePasswordForNewAccount(ctx.result, next);
            } else {
                next();
            }
        } else if (ctx.methodString === 'Account.changePassword') {
            var accessToken = (ctx.req.headers && ctx.req.headers.authorization) || (ctx.req.accessToken && ctx.req.accessToken.id) || false;
            var userId = (ctx.req.accessToken && ctx.req.accessToken.userId) || false;
            if (!userId && accessToken) {
                Account.app.models.AccessToken.findOne({
                    where: { id: accessToken }
                }, function (err, token) {
                    if (err) return next(err);
                    Account.updateAll({ id: token.userId }, { changePasswordRequired: false }, next);
                });
            } else if (userId) {
                Account.updateAll({ id: userId }, { changePasswordRequired: false }, next);
            } else {
                next();
            }
        } else {
            next();
        }
    });

    Account.afterRemoteError('**', function (ctx, next) {
        if (ctx.methodString === 'Account.login') {
            if (ctx.error.statusCode === 401 && ctx.error.code === 'LOGIN_FAILED') {
                var email = (ctx.args && ctx.args.credentials && ctx.args.credentials.email) || (ctx.req.body && ctx.req.body.email) || false;
                if (!email)
                    return next();
                Account.findOne({
                    where: { email: email }
                }, function (err, account) {
                    if (err || !account || account.locked || account.badPasswordCount >= BAD_PASSWORD_ATTEMPT || !account.active)
                        return next();
                    var badPasswordCount = account.badPasswordCount + 1;
                    var updateData = {
                        locked: badPasswordCount >= BAD_PASSWORD_ATTEMPT,
                        badPasswordCount: badPasswordCount,
                        lastBadPasswordAttempt: new Date()
                    }
                    account.updateAttributes(updateData, function (e, updatedAccount) {
                        if (e || !updatedAccount)
                            return next();
                        if (updatedAccount.locked || updatedAccount.badPasswordCount >= BAD_PASSWORD_ATTEMPT) {
                            Account.app.models.AccessToken.destroyAll({
                                userId: updatedAccount.id
                            }, function (err, info) {
                                next();
                            });
                        } else {
                            next();
                        }
                    });
                });
            } else {
                next();
            }
        } else {
            next();
        }
    });

    Account.resetAccountPassword = function (email, next) {
        Account.findOne({
            where: { email: email }
        }, function (err, account) {
            if (err || !account) return next(err);
            if (account.locked || account.badPasswordCount >= BAD_PASSWORD_ATTEMPT || !account.active) {
                var er = new Error('Account is locked.');
                er.statusCode = 403;
                er.name = 'Error';
                er.code = 'ACCOUNT_LOCKED';
                return next(er);
            }
            var code = passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '#') +
                passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '!');
            account.updateAttributes({ password: code, changePasswordRequired: true }, function (e, updatedAccount) {
                next(e);
                Account.emit('sendEmail', {
                    to: email,
                    subject: 'Password reset',
                    message: `
                        <p>Hello,</p>
                        </br>
                        <p>Your password has been successfully reset.</p>
                        <p>Please use your email and the following password: 
                        <strong>‘` + code + `’</strong>.</p>
                        </br>
                        <p>*Note: You should then change your password after login</p>
                        </br>
                        <p>Best Regards,</p>
                        <p>Codon Usage Bias Detection Support Team</p>
                    `
                });
            });
        });
    };

    Account.remoteMethod('resetAccountPassword', {
        accepts: { arg: 'email', type: 'string', required: true },
        returns: { type: 'any', root: true }
    });

    Account.on('sendEmail', function (info) {
        app.models.Email.send({
            to: info.to,
            from: '"Mobile No-Reply[CUB Detection]" <njivaolaf@gmail.com>',
            sender: 'njivaolaf@gmail.com',
            subject: info.subject,
            html: info.message
        }, function (err) { 
            if (err) return console.log('> error sending email:', err);
            console.log('> sending email to:', info.to);
        });
    });

    function passwordGenerator(length, chars) {
        var mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '01234567890123456789';
        if (chars.indexOf('!') > -1) mask += '!@#$%?';
        var result = '';
        for (var i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
        return result;
    }

    function generatePasswordForNewAccount(account, next) {
        app.models.Role.findOne({
            where: { name: 'user' }
        }, function (er, role) {
            if (er || !role) return next(er);
            role.principals.create({
                principalType: app.models.RoleMapping.USER,
                principalId: account.id
            }, function (e, principal) {
                if (e) return next(e);
                var code = passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '#') +
                    passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '!');
                account.updateAttribute('password', code, function (_err) {
                    next(_err);
                    Account.emit('sendEmail', {
                        to: account.email,
                        subject: 'Account created',
                        message: `
                            <p>Welcome to CBU detection,</p>
                            </br>
                            <p>Your account has been successfully created.</p>
                            <p>Please use your email and the following password: 
                            <strong>‘` + code + `’</strong>.</p>
                            </br>
                            <p>*Note: You should then change your password after login</p>
                            </br>
                            <p>Best Regards,</p>
                            <p>CBU detection Support Team</p>
                        `
                    });
                });
            });
        });
    }
};
