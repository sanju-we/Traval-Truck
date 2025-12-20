import z from "zod";
export class BaseValidator {
    async idValidator(id) {
        const schema = z.string();
        schema.parse(id);
    }
}
