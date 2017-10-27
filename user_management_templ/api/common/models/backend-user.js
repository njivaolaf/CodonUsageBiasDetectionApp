'use strict';

module.exports = function (Backenduser) {
    const CREATE = 'create';


    Backenduser.observe('before save', function beforeSave(ctx, next) {
        if (!ctx.isNewInstance) {
            Backenduser.app.models.Account.findOne({
                where: { id: ctx.data.account.id }
            }, function (error, userAccount) {
                if (error) {
                    return next(error);
                }
                else if (!userAccount) {
                    var accountNotFound = new Error();
                    accountNotFound.status = 404;
                    accountNotFound.message = 'Cannot set "isDelete" and "isActive", Account not found!';
                    accountNotFound.name = 'ACCOUNT_NOT_FOUND';
                    return next(accountNotFound);
                }
                else {
                    userAccount.isDeleted = !ctx.data.isActive;
                    userAccount.isActive = !ctx.data.isLock;

                    Backenduser.app.models.Account.upsert(userAccount, function (error, userAccountUpdatedCode) {
                        if (error) {
                            return next(error);
                        }
                        else {
                            next();
                        }
                    });
                }
            });
        }
        else {
            //BEFORE CREATING USER - CREATE ACCOUNT
            if (ctx.instance.__data.idAccount !== 1) {
                var newAccount = [
                    { email: ctx.instance.__data.userEmail, password: 'tempPassword' }
                ]
                Backenduser.app.models.Account.create(newAccount, function (error, newAccountUser) {
                    if (error) {
                        return next(error);
                    }
                    else {
                        // Create backenduser
                        ctx.instance.__data.idAccount = newAccountUser[0].id;
                        next();
                    }
                });
            } else {
                next();
            }
        }
    });


    ///// SEND PASSWORD ON CREATE
    Backenduser.observe('after save', function afterSave(ctx, next) {
        if (ctx.isNewInstance && ctx.instance.id !== 1) {
            // AFTER BACKEND CREATED
            // Generate password
            var code = passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '#') +
                passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '!');

            var messageTitle = '[CBU detection] Account created';

            var messageDetail =
                `<p>Welcome to CBU detection,</p>
                                </br>
                                <p>Your account has been successfully created.</p>
                                <p>Please use your email and the following password: 
                                <strong>‘` + code + `’</strong>.</p>
                                </br>
                                <p>*Note: You should then change your password after login</p>
                                </br>
                                <p>Best Regards,</p>
                                <p>CBU detection Support Team</p>`;

            // Get Account
            Backenduser.app.models.Account.findOne({
                where: {
                    email: ctx.instance.userEmail
                }
            }, function (error, userAccount) {
                if (error) {
                    return next(error);
                }
                else if (!userAccount) {
                    var accountNotFound = new Error();
                    accountNotFound.status = 404;
                    accountNotFound.message = 'Account not found!';
                    accountNotFound.name = 'ACCOUNT_NOT_FOUND';
                    return next(accountNotFound);
                }
                else {
                    // UPDATE ACCOUNT PASSWORD
                    userAccount.password = code;

                    Backenduser.app.models.Account.upsert(userAccount, function (error, userAccountUpdatedCode) {
                        if (error) {
                            return next(error);
                        }
                        else {
                            // Send email after set password
                            var mailStatus = mailSender(1, CREATE, userAccount.email, messageTitle, messageDetail)
                            next();
                        }
                    });
                }
            });

        }
        else {
            // AFTER BACKEND UPDATED, CHECK IF IS DELETED
            /*if (ctx.instance.__data.isDeleted) {
                Backenduser.app.models.Account.findOne({
                    where: { email: ctx.instance.userEmail }
                }, function (error, userAccount) {
                    if (error) {
                        return next(error);
                    }
                    else if (!userAccount) {
                        var accountNotFound = new Error();
                        accountNotFound.status = 404;
                        accountNotFound.message = 'Cannot set "isDelete" and "isActive", Account not found!';
                        accountNotFound.name = 'ACCOUNT_NOT_FOUND';
                        return next(accountNotFound);
                    }
                    else {
                        userAccount.__data.isDeleted = true;
                        userAccount.__data.isActive = false;

                        Backenduser.app.models.Account.upsert(userAccount, function (error, userAccountUpdatedCode) {
                            if (error) {
                                return next(error);
                            }
                            else {
                                next();
                            }
                        });
                    }
                });
            }*/
            next();
        }
    });
    ///// END SEND PASSWORD ON CREATE

    ///// RESET PASSWORD
    Backenduser.resetUserPassword = function (userEmail, next) {
        var accountNotFound = new Error();
        accountNotFound.status = 404;
        accountNotFound.message = 'Account not found!';
        accountNotFound.name = 'ACCOUNT_NOT_FOUND';

        if (userEmail) {
            Backenduser.app.models.Account.findOne({
                where: { email: userEmail }
            }, function (error, userAccount) {
                if (error) {
                    next(error);
                }
                else if (!userAccount) {
                    return next(accountNotFound);
                }
                else if (userAccount.__data.isDeleted || !userAccount.__data.isActive) {
                    return next(accountNotFound);
                }
                else {
                    var code = passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '#') +
                        passwordGenerator(1, 'a') + passwordGenerator(1, '#') + passwordGenerator(1, 'A') + passwordGenerator(1, '!');

                    var messageTitle = 'Password reset';

                    var messageDetail =
                        `<p>Hello,</p>
                                </br>
                                <p>Your password has been successfully reset.</p>
                                <p>Please use your email and the following password: 
                                <strong>‘` + code + `’</strong>.</p>
                                </br>
                                <p>*Note: You should then change your password after login</p>
                                </br>
                                <p>Best Regards,</p>
                                <p>CBU detection Support Team</p>`;

                    // UPDATE ACCOUNT PASSWORD
                    userAccount.password = code;

                    Backenduser.app.models.Account.upsert(userAccount, function (error, userAccountUpdatedCode) {
                        if (error) {
                            return next(error);
                        }
                        else {
                            // Send email after set password

                            var mailStatus = mailSender(1, CREATE, userAccount.email, messageTitle, messageDetail)

                            next(null, 'PASSWORD_RESET');
                        }
                    });

                }
            });
        }
        else {
            return next(accountNotFound)
        }
    }

    Backenduser.remoteMethod(
        'resetUserPassword', {
            accepts: {
                arg: 'UserEmail',
                type: 'string'
            },
            returns: {
                arg: 'data',
                type: 'string'
            },
            http: {
                path: '/resetUserPassword',
                verb: 'post'
            }
        });
    ///// END RESET PASSWORD



    ///// MAIL SENDER 
    function mailSender(_counter, mode, _to, _messageTitle, _messageDetail) {
        var message = 'Error';
        if (mode == CREATE) {
            message = {
                to: _to,
                from: '"CUB Detection" <njivaolaf@gmail.com>',
                sender: 'njivaolaf@gmail.com',
                subject: _messageTitle,
                html: _messageDetail
            }
        }

        Backenduser.app.models.Email.send(
            message
            , function (error, mail) {
                if (error) {
                    if (_counter < 4) {
                        console.error("SEND MAIL ERROR ATTEMPT: " + _counter + " TO USER: " + _to);
                        console.error(error);
                        if (_counter < 3) {
                            _counter = _counter + 1;
                            console.error("ATTEMPT: " + _counter + " SEND MAIL TO USER: " + _to);
                        } else {
                            _counter = _counter + 1;
                            console.error(" LAST ATTEMPT TO SEND MAIL TO USER: " + _to);
                        }

                        var result = mailSender(_counter, mode, _to, _messageTitle, _messageDetail);
                    } else {
                        console.error("MAIL CANNOT BE SEND AFTER 3 ATTEMPT TO: " + _to);
                        console.error(error);
                    }
                }
                console.error(mail);
            });
    }

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

}
