import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
    @ApiProperty({ type : String})
    readonly userId: string;

    @ApiProperty({ type : String})
    readonly description: string;

    @ApiProperty({ type : Number})
    readonly latitude: string;

    @ApiProperty({ type : Number})
    readonly longitude: string;
}
