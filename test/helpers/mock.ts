import * as sinon from 'sinon';

export type Mock<T> = {
    [K in keyof T]: sinon.SinonStub;
};

export function mock<T>(constructor: { new(...args: any[]): T }): Mock<T> {
    return sinon.createStubInstance(constructor);
}