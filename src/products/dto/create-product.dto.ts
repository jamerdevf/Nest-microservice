import { Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateProductDto {

    @IsString()
    public name: string;

    @IsNumber({
        maxDecimalPlaces: 4
    })
    @Min(0)
    @Type( () => Number ) // Intenta hacer la transformación de string a number en el body
    public price: number;

}
