export class CustomUtils {

    truncateString(stringToTruncate: string, maxChar: number): string {
        if (stringToTruncate.length > maxChar) {
            return stringToTruncate.substring(0, maxChar).concat('...');
        } else {
            return stringToTruncate;
        }
    }
    

}
