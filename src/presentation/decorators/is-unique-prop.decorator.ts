import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsUniqueProp(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueProp',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (!Array.isArray(value)) return false;
          const constraints = args.constraints as unknown[];
          const propName = String(constraints[0]);
          const props = value
            .map((item) => {
              const obj = item as Record<string, unknown>;
              return obj[propName];
            })
            .filter((p) => p !== undefined && p !== null);
          return new Set(props).size === props.length;
        },
        defaultMessage(args: ValidationArguments) {
          const constraints = args.constraints as unknown[];
          const propName = String(constraints[0]);
          return `Các giá trị ${propName} trong danh sách không được trùng lặp`;
        },
      },
    });
  };
}
