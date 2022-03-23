import { Matrix4 } from "./jomlmatrix4"
import { Quaternion } from "./jomlquaternion"

export type rawMatrix3 = {
    [key: number]: [number, number, number]
    0: [number, number, number]
    1: [number, number, number]
    2: [number, number, number]
    3: [number, number, number]
}

export class Matrix3 {
    [key: number]: [number, number, number]
    0: [number, number, number]
    1: [number, number, number]
    2: [number, number, number]
    3: [number, number, number]

    m00: number; m10: number; m20: number;
    m01: number; m11: number; m21: number;
    m02: number; m12: number; m22: number;


    constructor(m: rawMatrix3) {
        this.set(m);
    }

    set(m: rawMatrix3 | Matrix4 | Quaternion): Matrix3 {
        if (m instanceof Quaternion) {
            return;
        }

        for (let x = 0; x < 3; ++x) {
            for (let y = 0; y < 3; ++y) {
                this[x][y] = m[x][y]
            }
        }
        return this;
    }
}