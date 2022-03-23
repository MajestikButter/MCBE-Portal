/*
 * The MIT License
 *
 * Copyright (c) 2015-2021 Richard Greenlees
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { BlockLocation, Location } from "mojang-minecraft";
import { Matrix3 } from "./matrix3.js";
import { Matrix4 } from "./jomlmatrix4.js";
import { Vector2 } from "./jomlvector2.js";
import { Quaternion } from "./jomlquaternion.js";

export type Vector3Like = {
    x: number,
    y: number,
    z: number,
}

export class Vector3 {
    /**
     * The x component of the vector.
     */
    public x: number;
    /**
     * The y component of the vector.
     */
    public y: number;
    /**
     * The z component of the vector.
     */
    public z: number;

    /**
     * Create a new {@link Vector3} of `(0, 0, 0)`.
     */
    constructor();
    /**
     * Create a new {@link Vector3} and initialize all three components with the given value.
     * 
     * @param d the value of all three components
     */
    constructor(d: number);
    /**
     * Create a new {@link Vector3} with the same values as `v`.
     * 
     * @param v the {@link Vector3} to copy the values from
     */
    constructor(v: Vector3Like);
    /**
     * Create a new {@link Vector3} with the first two components from the
     * given `v` and the given `z`
     * 
     * @param v the {@link Vector2} to copy the values from
     * @param z the z component
     */
    constructor(v: Vector2, z: number);
    /**
     * Create a new {@link Vector3} with the given component values.
     * 
     * @param x the value of x
     * @param y the value of y
     * @param z the value of z
     */
    constructor(x: number, y: number, z: number);
    constructor(x?: number | Vector2 | Vector3Like, y?: number, z?: number) {
        if (x === undefined) {              // ()
            z = 0, y = 0, x = 0;
        } else if (x instanceof Vector2) {  // (v: Vector2, z: number)
            z = y, y = x.y, x = x.x;
        } else if (typeof x === 'object') { // (v: IVector3)
            z = x.z, y = x.y, x = x.x;
        } else if (y == undefined) {        // (d: number)
            z = x, y = x, x = x;
        }                                   // (x: number, y: number, z: number)

        this.x = x;
        this.y = y;
        this.z = z;
    }

    toLocation(): Location {
        return new Location(this.x, this.y, this.z);
    }
    toBlockLocation(): BlockLocation {
        return new BlockLocation(this.x, this.y, this.z);
    }

    /**
     * Set the x, y and z components to match the supplied vector.
     * 
     * @param v contains the values of x, y and z to set
     * @return this
     */
    public set(v: Vector3): Vector3;
    /**
     * Set the first two components from the given `v`
     * and the z component from the given `z`
     * 
     * @param v the {@link Vector2} to copy the values from
     * @param z the z component
     * @return this
     */
    public set(v: Vector2, z: number): Vector3;
    /**
     * Set the x, y, and z components to the supplied value.
     * 
     * @param d the value of all three components
     * @return this
     */
    public set(d: number): Vector3;
    /**
     * Set the x, y and z components to the supplied values.
     * 
     * @param x the x component
     * @param y the y component 
     * @param z the z component
     * @return this
     */
    public set(x: number, y: number, z: number): Vector3;
    public set(x?: number | Vector2 | Vector3, y?: number, z?: number): Vector3 {
        if (x === undefined) {              // ()
            z = 0, y = 0, x = 0;
        } else if (x instanceof Vector2) {  // (v: Vector2, z: number)
            z = y, y = x.y, x = x.x;
        } else if (x instanceof Vector3) {  // (v: Vector3)
            z = x.z, y = x.y, x = x.x;
        } else if (y == undefined) {        // (d: number)
            z = x, y = x, x = x;
        }                                   // (x: number, y: number, z: number)

        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Set the value of the specified component of this vector.
     * 
     * @param component the component whose value to set, within `[0..2]`
     * @param value the value to set
     * @return this
     * @throws IllegalArgumentException if `component` is not within `[0..2]`
     */
    public setComponent(component: number, value: number) {
        switch (component) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw "IllegalArgumentException";
        }
        return this;
    }

    /**
     * Subtract the supplied vector from this one and store the result in `this`.
     * 
     * @param v the vector to subtract
     * @return this
     */
    public sub(v: Vector3, dest?: Vector3): Vector3;

    /**
     * Decrement the components of this vector by the given values.
     * 
     * @param x the x component to subtract
     * @param y the y component to subtract
     * @param z the z component to subtract
     * @return this
     */
    public sub(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public sub(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }

        dest.x = this.x - x;
        dest.y = this.y - y;
        dest.z = this.z - z;
        return dest;
    }

    /**
     * Add the supplied vector to this one.
     * 
     * @param v the vector to add
     * @return this
     */
    public add(v: Vector3, dest?: Vector3): Vector3;

    /**
     * Increment the components of this vector by the given values.
     * 
     * @param x the x component to add
     * @param y the y component to add
     * @param z the z component to add
     * @return this
     */
    public add(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public add(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }

        dest.x = this.x + x;
        dest.y = this.y + y;
        dest.z = this.z + z;
        return dest;
    }

    /**
     * Add the component-wise multiplication of `a * b` to this vector.
     * 
     * @param a the first multiplicand
     * @param b the second multiplicand
     * @return this
     */
    public fma(a: Vector3, b: Vector3, dest?: Vector3): Vector3;
    /**
     * Add the component-wise multiplication of `a * b` to this vector.
     * 
     * @param a the first multiplicand
     * @param b the second multiplicand
     * @return this
     */
    public fma(a: number, b: Vector3, dest?: Vector3): Vector3;
    public fma(a: number | Vector3, b: Vector3, dest?: Vector3): Vector3 {
        dest = dest ?? this;
        if (!(a instanceof Vector3)) {
            a = { x: a, y: a, z: a } as Vector3;
        }
        dest.x = a.x * b.x + this.x;
        dest.y = a.y * b.y + this.y;
        dest.z = a.z * b.z + this.z;
        return dest;
    }

    /**
     * Add the component-wise multiplication of `this * a` to `b`
     * and store the result in `this`.
     * 
     * @param a the multiplicand
     * @param b the addend
     * @return this
     */
    public mulAdd(a: Vector3, b: Vector3, dest?: Vector3): Vector3;

    /**
     * Add the component-wise multiplication of `this * a` to `b`
     * and store the result in `this`.
     * 
     * @param a the multiplicand
     * @param b the addend
     * @return this
     */
    public mulAdd(a: number, b: Vector3, dest?: Vector3): Vector3;
    public mulAdd(a: number | Vector3, b: Vector3, dest?: Vector3) {
        dest = dest ?? this;
        if (!(a instanceof Vector3)) {
            a = { x: a, y: a, z: a } as Vector3;
        }
        dest.x = this.x * a.x + b.x;
        dest.y = this.y * a.y + b.y;
        dest.z = this.z * a.z + b.z;
        return dest;
    }

    /**
     * Multiply the given matrix `mat` with this Vector3f, perform perspective division.
     * 
     * - This method uses `w=1.0` as the fourth vector component.
     * @param mat the matrix to multiply this vector by
     * @return this
     */
    public mulProject(mat: Matrix4, dest?: Vector3): Vector3;
    public mulProject(mat: Matrix4, w: number, dest?: Vector3): Vector3;
    public mulProject(mat: Matrix4, w?: number | Vector3, dest?: Vector3): Vector3 {
        dest = dest ?? ((w instanceof Vector3) ? w : this);
        if (w instanceof Vector3 || w === undefined) {
            w = 1;
        }
        const x = this.x, y = this.y, z = this.z;
        const invW = 1.0 / (mat[0][3] * x + mat[1][3] * y + mat[2][3] * z + mat[3][3] * w);
        dest.x = (mat[0][0] * x + mat[1][0] * y + mat[2][0] * z + mat[3][0]) * invW;
        dest.y = (mat[0][1] * x + mat[1][1] * y + mat[2][1] * z + mat[3][1]) * invW;
        dest.z = (mat[0][2] * x + mat[1][2] * y + mat[2][2] * z + mat[3][2]) * invW;
        return dest;
    }

    /**
     * Multiply the transpose of the given matrix with this Vector3f store the result in `this`.
     * 
     * @param mat the matrix
     * @return this
     */
    public mulTranspose(mat: Matrix3, dest: Vector3) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z;
        return dest;
    }

    /**
     * Multiply the given 4x4 matrix `mat` with `this`.
     * <p>
     * This method assumes the `w` component of `this` to be `1.0`.
     * 
     * @param mat the matrix to multiply this vector by
     * @return this
     */
    public mulPosition(mat: Matrix4, dest?: Vector3) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        this.x = mat[0][0] * x + mat[1][0] * y + mat[2][0] * z + mat[3][0];
        this.y = mat[0][1] * x + mat[1][1] * y + mat[2][1] * z + mat[3][1];
        this.z = mat[0][2] * x + mat[1][2] * y + mat[2][2] * z + mat[3][2];
        return this;
    }

    /**
     * Multiply the transpose of the given 4x4 matrix `mat` with `this`.
     * 
     * - This method assumes the `w` component of `this` to be `1.0`.
     * 
     * @param mat the matrix whose transpose to multiply this vector by
     * @return this
     */
    public mulTransposePosition(mat: Matrix4, dest?: Vector3) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        this.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z + mat[0][3];
        this.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z + mat[1][3];
        this.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z + mat[2][3];
        return this;
    }

    /**
     * Multiply the given 4x4 matrix `mat` with `this` and return the <i>w</i> component
     * of the resulting 4D vector.
     * 
     * - This method assumes the `w` component of `this` to be `1.0`.
     * 
     * @param mat the matrix to multiply this vector by
     * @return the <i>w</i> component of the resulting 4D vector after multiplication
     */
    public mulPositionW(mat?: Matrix4, dest?: Vector3) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        const w = mat[0][3] * x + mat[1][3] * y + mat[2][3] * z + mat[3][3];
        this.x = mat[0][0] * x + mat[1][0] * y + mat[2][0] * z + mat[3][0];
        this.y = mat[0][1] * x + mat[1][1] * y + mat[2][1] * z + mat[3][1];
        this.z = mat[0][2] * x + mat[1][2] * y + mat[2][2] * z + mat[3][2];
        return w;
    }

    /**
     * Multiply the given 4x4 matrix `mat` with `this`.
     * 
     * - This method assumes the `w` component of `this` to be `0.0`.
     * 
     * @param mat the matrix to multiply this vector by
     * @return this
     */
    public mulDirection(mat: Matrix4, dest?: Vector3) {
        dest = dest ?? this
        const x = this.x, y = this.y, z = this.z;
        this.x = mat[0][0] * x + mat[1][0] * y + mat[2][0] * z;
        this.y = mat[0][1] * x + mat[1][1] * y + mat[2][1] * z;
        this.z = mat[0][2] * x + mat[1][2] * y + mat[2][2] * z;
        return this;
    }

    /**
     * Multiply the transpose of the given 4x4 matrix `mat` with `this`.
     * 
     * - This method assumes the `w` component of `this` to be `0.0`.
     * 
     * @param mat the matrix whose transpose to multiply this vector by
     * @return this
     */
    public mulTransposeDirection(mat: Matrix4, dest?: Vector3) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z;
        return dest;
    }

    /**
     * Multiply all components of this {@link Vector3} by the given scalar
     * value.
     * 
     * @param scalar the scalar to multiply this vector by
     * @return this
     */
    public mul(scalar: number, dest?: Vector3): Vector3;
    /**
     * Multiply the components of this Vector3f by the given scalar values and store the result in `dest` or `this`.
     * 
     * @param x the x component to multiply this vector by
     * @param y the y component to multiply this vector by
     * @param z the z component to multiply this vector by
     * @return this
     */
    public mul(x: number, y: number, z: number, dest?: Vector3): Vector3;
    /**
     * Multiply this Vector3f component-wise by another Vector3fc.
     * 
     * @param v the vector to multiply by
     * @return this
     */
    public mul(v: Vector3, dest?: Vector3): Vector3;
    /**
     * Multiply the given matrix with this Vector3f and store the result in `dest` or `this`.
     * 
     * @param mat the matrix
     * @return this
     */
    public mul(mat: Matrix3, dest?: Vector3): Vector3;
    public mul(x: number | Vector3 | Matrix3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Matrix3) {         // (mat: Matrix3, dest?: Vector3)
            const lx = this.x, ly = this.y, lz = this.z;
            dest.x = x[0][0] * lx + x[1][0] * ly + x[2][0] * lz;
            dest.y = x[0][1] * lx + x[1][1] * ly + x[2][1] * lz;
            dest.z = x[0][2] * lx + x[1][2] * ly + x[2][2] * lz;
            return dest;
        } else if (x instanceof Vector3) {  // (v: Vector3, dest?: Vector3)
            z = x.z, y = x.y, x = x.x;
        } else if (z === undefined) {       // (scalar: number, dest?: Vector3)
            z = x, y = x, x = x;
        } else {                            // (x: number, y: number, z: number, dest?: Vector3)
            y = y as number;
        }
        dest.x = this.x * x;
        dest.y = this.y * y;
        dest.z = this.z * z;
        return dest;
    }

    /**
     * Divide this Vector3f component-wise by another Vector3fc.
     * 
     * @param v the vector to divide by
     * @return this
     */
    public div(v: Vector3, dest?: Vector3): Vector3;
    /**
     * Divide all components of this {@link Vector3} by the given scalar
     * value.
     * 
     * @param scalar the scalar to divide by
     * @return this
     */
    public div(scalar: number, dest?: Vector3): Vector3;
    /**
     * Divide the components of this Vector3f by the given scalar values and store the result in `this`.
     * 
     * @param x the x component to divide this vector by
     * @param y the y component to divide this vector by
     * @param z the z component to divide this vector by
     * @return this
     */
    public div(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public div(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {     // (v: Vector3, dest?: Vector3)
            z = x.z, y = x.y, x = x.x;
        } else if (z === undefined) {   // (scalar: number, dest?: Vector3)
            z = x, y = x, x = x;
        } else {                        // (x: number, y: number, z: number, dest?: Vector3)
            y = y as number;
        }
        dest.x = this.x / x;
        dest.y = this.y / y;
        dest.z = this.z / z;
        return dest;
    }

    /**
     * Rotate this vector by the given quaternion `quat` and store the result in `this`.
     * 
     * @see Quaternionfc#transform(Vector3f)
     * 
     * @param quat the quaternion to rotate this vector
     * @return this
     */
    public rotate(quat: Quaternion, dest?: Vector3): Vector3 {
        dest = dest ?? this;
        return quat.transform(this, dest);
    }

    public rotationTo(toDir: Vector3, dest?: Quaternion): Quaternion;
    public rotationTo(toDirX: number, toDirY: number, toDirZ: number, dest?: Quaternion): Quaternion;
    public rotationTo(toDirX: number | Vector3, toDirY?: number | Quaternion, toDirZ?: number, dest?: Quaternion): Quaternion {
        dest = dest ?? (toDirY instanceof Quaternion ? toDirY : new Quaternion);
        if (toDirX instanceof Vector3) {
            toDirZ = toDirX.z, toDirY = toDirX.y, toDirX = toDirX.x;
        } else {
            toDirY = toDirY as number;
        }
        return dest.rotationTo(this.x, this.y, this.z, toDirX, toDirY, toDirZ);
    }

    /**
     * Rotate this vector the specified radians around the given rotation axis.
     * 
     * @param angle the angle in radians
     * @param x the x component of the rotation axis
     * @param y the y component of the rotation axis
     * @param z the z component of the rotation axis
     * @return this
     */
    public rotateAxis(angle: number, aX: number, aY: number, aZ: number, dest?: Vector3) {
        dest = dest ?? this;
        if (aY === 0.0 && aZ === 0.0 && Math.abs(aX) === 1)
            return this.rotateX(aX * angle, dest);
        else if (aX === 0.0 && aZ === 0.0 && Math.abs(aY) === 1)
            return this.rotateY(aY * angle, dest);
        else if (aX === 0.0 && aY === 0.0 && Math.abs(aZ) === 1)
            return this.rotateZ(aZ * angle, dest);

        const hangle = angle * 0.5;
        const sinAngle = Math.sin(hangle);
        const qx = aX * sinAngle, qy = aY * sinAngle, qz = aZ * sinAngle;
        const qw = Math.cos(hangle);
        const w2 = qw * qw, x2 = qx * qx, y2 = qy * qy, z2 = qz * qz, zw = qz * qw;
        const xy = qx * qy, xz = qx * qz, yw = qy * qw, yz = qy * qz, xw = qx * qw;
        const x = this.x, y = this.y, z = this.z;
        dest.x = (w2 + x2 - z2 - y2) * x + (-zw + xy - zw + xy) * y + (yw + xz + xz + yw) * z;
        dest.y = (xy + zw + zw + xy) * x + (y2 - z2 + w2 - x2) * y + (yz + yz - xw - xw) * z;
        dest.z = (xz - yw + xz - yw) * x + (yz + yz + xw + xw) * y + (z2 - y2 - x2 + w2) * z;
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the X axis.
     * 
     * @param angle the angle in radians
     * @return this
     */
    public rotateX(angle: number, dest?: Vector3) {
        dest = dest ?? this;
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        dest.x = this.x;
        dest.y = y;
        dest.z = z;
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the Y axis.
     * 
     * @param angle the angle in radians
     * @return this
     */
    public rotateY(angle: number, dest?: Vector3) {
        dest = dest ?? this;
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos + this.z * sin;
        const z = -this.x * sin + this.z * cos;
        dest.x = x;
        dest.y = this.y;
        dest.z = z;
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the Z axis.
     * 
     * @param angle the angle in radians
     * @return this
     */
    public rotateZ(angle: number, dest?: Vector3) {
        dest = dest ?? this;
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        dest.x = x;
        dest.y = y;
        dest.z = this.z;
        return dest;
    }

    public lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * Get the length squared of a 3-dimensional single-precision vector.
     *
     * @param x The vector's x component
     * @param y The vector's y component
     * @param z The vector's z component
     *
     * @return the length squared of the given vector
     *
     * @author F. Neurath
     */
    public static lengthSquared(x: number, y: number, z: number) {
        return x * x + y * y + z * z;
    }

    public length() {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * Get the length of a 3-dimensional single-precision vector.
     *
     * @param x The vector's x component
     * @param y The vector's y component
     * @param z The vector's z component
     *
     * @return the length of the given vector
     */
    // public static length(x: number, y: number, z: number) {
    //     return Math.sqrt(x * x + y * y + z * z);
    // }

    /**
     * Normalize this vector.
     * 
     * @return this
     */
    public normalize(dest?: Vector3): Vector3;
    /**
     * Scale this vector to have the given length.
     * 
     * @param length the desired length
     * @return this
     */
    public normalize(length: number, dest?: Vector3): Vector3;
    public normalize(length?: number | Vector3, dest?: Vector3): Vector3 {
        dest = dest ?? ((length instanceof Vector3) ? length : this);
        if (length instanceof Vector3 || length === undefined) {
            length = 1;
        }
        const scalar = 1 / Math.sqrt(this.lengthSquared()) * length;
        dest.x = this.x * scalar;
        dest.y = this.y * scalar;
        dest.z = this.z * scalar;
        return dest;
    }

    /**
     * Set this vector to be the cross product of itself and `v`.
     * 
     * @param v the other vector
     * @return this
     */
    public cross(v: Vector3, dest?: Vector3): Vector3;
    /**
     * Set this vector to be the cross product of itself and `(x, y, z)`.
     * 
     * @param x the x component of the other vector
     * @param y the y component of the other vector
     * @param z the z component of the other vector
     * @return this
     */
    public cross(x: number, y: number, z: number, dest: Vector3): Vector3;
    public cross(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }
        const rx = this.y * z - this.z * y;
        const ry = this.z * x - this.x * z;
        const rz = this.x * y - this.y * x;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        return dest;
    }

    public distance(v: Vector3): number;
    public distance(x: number, y: number, z: number): number;
    public distance(x: number | Vector3, y?: number, z?: number): number {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        return Math.sqrt(this.distanceSquared(x, y, z));
    }

    public distanceSquared(v: Vector3): number;
    public distanceSquared(x: number, y: number, z: number): number;
    public distanceSquared(x: number | Vector3, y?: number, z?: number): number {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        const dx = this.x - x;
        const dy = this.y - y;
        const dz = this.z - z;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Return the distance between `(x1, y1, z1)` and `(x2, y2, z2)`.
     *
     * @param x1 the x component of the first vector
     * @param y1 the y component of the first vector
     * @param z1 the z component of the first vector
     * @param x2 the x component of the second vector
     * @param y2 the y component of the second vector
     * @param z2 the z component of the second vector
     * @return the euclidean distance
     */
    public static distance(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        return Math.sqrt(this.distanceSquared(x1, y1, z1, x2, y2, z2));
    }

    /**
     * Return the squared distance between `(x1, y1, z1)` and `(x2, y2, z2)`.
     *
     * @param x1 the x component of the first vector
     * @param y1 the y component of the first vector
     * @param z1 the z component of the first vector
     * @param x2 the x component of the second vector
     * @param y2 the y component of the second vector
     * @param z2 the z component of the second vector
     * @return the euclidean distance squared
     */
    public static distanceSquared(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        return dx * dx + dy * dy + dz * dz;
    }

    /**
     * Get the dot product of this vector and v.
     * 
     * @param v the vector to dot multiply
     * @return the dot product
     */
    public dot(v: Vector3): number;
    /**
      * Get the dot product of this vector and (x, y, z).
      * 
      * @param x the x component to dot multiply
      * @param y the y component to dot multiply
      * @param z the z component to dot multiply
      * @return the dot product
      */
    public dot(x: number, y: number, z: number): number;
    public dot(x: number | Vector3, y?: number, z?: number): number {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        return this.x * x + this.y * y + this.z * z;
    }


    public angleCos(v: Vector3) {
        const x = this.x, y = this.y, z = this.z;
        const length1Squared = x * x + y * y + z * z;
        const length2Squared = v.x * v.x + v.y * v.y + v.z * v.z;
        const dot = x * v.x + y * v.y + z * v.z;
        return dot / Math.sqrt(length1Squared * length2Squared);
    }

    public angle(v: Vector3) {
        let cos = this.angleCos(v);
        // This is because sometimes cos goes above 1 or below -1 because of lost precision
        cos = cos < 1 ? cos : 1;
        cos = cos > -1 ? cos : -1;
        return Math.acos(cos);
    }

    public angleSigned(v: Vector3, n: Vector3): number;
    public angleSigned(x: number, y: number, z: number, nx: number, ny: number, nz: number): number;
    public angleSigned(x: number | Vector3, y: number | Vector3, z?: number, nx?: number, ny?: number, nz?: number) {
        if (y instanceof Vector3) {
            nz = y.z, ny = y.y, nx = y.x;
            y = 0;
        }
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }

        const tx = this.x, ty = this.y, tz = this.z;
        return Math.atan2(
            (ty * z - tz * y) * nx + (tz * x - tx * z) * ny + (tx * y - ty * x) * nz,
            tx * x + ty * y + tz * z);
    }


    /**
     * Set the components of this vector to be the component-wise minimum of this and the other vector.
     *
     * @param v the other vector
     * @return this
     */
    public min(v: Vector3, dest?: Vector3) {
        dest = dest ?? this;
        const x = this.x, y = this.y, z = this.z;
        dest.x = x < v.x ? x : v.x;
        dest.y = y < v.y ? y : v.y;
        dest.z = z < v.z ? z : v.z;
        return dest;
    }

    /**
     * Set the components of this vector to be the component-wise maximum of this and the other vector.
     * 
     * @param v the other vector
     * @return this
     */
    public max(v: Vector3, dest: Vector3) {
        const x = this.x, y = this.y, z = this.z;
        dest.x = x > v.x ? x : v.x;
        dest.y = y > v.y ? y : v.y;
        dest.z = z > v.z ? z : v.z;
        return dest;
    }

    /**
     * Set all components to zero.
     * 
     * @return this
     */
    public zero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        return this;
    }

    /**
     * Return a string representation of this vector.
     * 
     * @return the string representation
     */
    public toString(formatter?: (x: number, place: 'x' | 'y' | 'z') => string) {
        formatter = formatter ?? ((x) => x.toFixed(20));
        return `${formatter(this.x, 'x')} ${formatter(this.y, 'y')} ${formatter(this.z, 'z')}`;
    }

    /**
     * Negate this vector.
     * 
     * @return this
     */
    public negate(dest?: Vector3) {
        return this.applyFunction(x => -x, dest);
    }

    /**
     * Set `this` vector's components to their respective absolute values.
     * 
     * @return this
     */
    public absolute(dest?: Vector3) {
        return this.applyFunction(Math.abs, dest);
    }

    // public int hashCode() {
    //     final int prime = 31;
    //     int result = 1;
    //     result = prime * result + Float.floatToIntBits(x);
    //     result = prime * result + Float.floatToIntBits(y);
    //     result = prime * result + Float.floatToIntBits(z);
    //     return result;
    // }

    public equals(v: Vector3, delta?: number): boolean;
    public equals(x: number, y: number, z: number): boolean;
    public equals(x: number | Vector3, y?: number, z?: number, delta?: number): boolean {
        delta = delta ?? (x instanceof Vector3 ? y ?? 0 : 0);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        return (
            Math.abs(this.x - x) <= delta &&
            Math.abs(this.y - y) <= delta &&
            Math.abs(this.z - z) <= delta
        );
    }

    /**
     * Reflect this vector about the given `normal` vector.
     * 
     * @param normal the vector to reflect about
     * @return this
     */
    public reflect(normal: Vector3, dest?: Vector3): Vector3;
    /**
     * Reflect this vector about the given normal vector.
     * 
     * @param x the x component of the normal
     * @param y the y component of the normal
     * @param z the z component of the normal
     * @return this
     */
    public reflect(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public reflect(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) { // (normal: Vector3, dest?: Vector3)
            z = x.z, y = x.y, x = x.x;
        } else {                    // (x: number, y: number, z: number, dest?: Vector3)
            y = y as number;
        }
        const dot = this.dot(x, y, z);
        dest.x = this.x - (dot + dot) * x;
        dest.y = this.y - (dot + dot) * y;
        dest.z = this.z - (dot + dot) * z;
        return dest;
    }

    /**
     * Compute the half vector between this and the other vector.
     * 
     * @param other
     *          the other vector
     * @return this
     */
    public half(other: Vector3, dest?: Vector3): Vector3;

    /**
     * Compute the half vector between this and the vector `(x, y, z)`.
     * 
     * @param x the x component of the other vector
     * @param y the y component of the other vector
     * @param z the z component of the other vector
     * @return this
     */
    public half(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public half(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        dest = dest ?? ((y instanceof Vector3) ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }
        return dest.set(this).add(x, y, z).normalize();
    }

    public smoothStep(v: Vector3, t: number, dest: Vector3) {
        const x = this.x, y = this.y, z = this.z;
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (x + x - v.x - v.x) * t3 + (3.0 * v.x - 3.0 * x) * t2 + x * t + x;
        dest.y = (y + y - v.y - v.y) * t3 + (3.0 * v.y - 3.0 * y) * t2 + y * t + y;
        dest.z = (z + z - v.z - v.z) * t3 + (3.0 * v.z - 3.0 * z) * t2 + z * t + z;
        return dest;
    }

    public hermite(t0: Vector3, v1: Vector3, t1: Vector3, t: number, dest: Vector3) {
        const x = this.x, y = this.y, z = this.z;
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (x + x - v1.x - v1.x + t1.x + t0.x) * t3 + (3.0 * v1.x - 3.0 * x - t0.x - t0.x - t1.x) * t2 + x * t + x;
        dest.y = (y + y - v1.y - v1.y + t1.y + t0.y) * t3 + (3.0 * v1.y - 3.0 * y - t0.y - t0.y - t1.y) * t2 + y * t + y;
        dest.z = (z + z - v1.z - v1.z + t1.z + t0.z) * t3 + (3.0 * v1.z - 3.0 * z - t0.z - t0.z - t1.z) * t2 + z * t + z;
        return dest;
    }

    /**
     * Linearly interpolate `this` and `other` using the given interpolation factor `t`
     * and store the result in `this`.
     * <p>
     * If `t` is `0.0` then the result is `this`. If the interpolation factor is `1.0`
     * then the result is `other`.
     * 
     * @param other the other vector
     * @param t the interpolation factor between 0.0 and 1.0
     * @return this
     */
    public lerp(other: Vector3, t: number, dest?: Vector3) {
        dest.x = (other.x - this.x) * t + this.x;
        dest.y = (other.y - this.y) * t + this.y;
        dest.z = (other.z - this.z) * t + this.z;
        return dest;
    }

    public get(component: number): number;
    public get(dest: Vector3): Vector3;
    public get(mode: (x: number) => number, dest: Vector3): Vector3;
    public get(mode: number | Vector3 | ((x: number) => number), dest?: Vector3): Vector3 | number {
        if (typeof mode === "number") { // (component: number)
            switch (mode) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                default:
                    throw new Error("IllegalArgumentException");
            }
        }
        if (mode instanceof Vector3) {
            dest = mode;
            mode = (x) => x;
        }
        return this.applyFunction(mode, dest);
    }

    public maxComponent() {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        if (absX >= absY && absX >= absZ) {
            return 0;
        } else if (absY >= absZ) {
            return 1;
        }
        return 2;
    }

    public minComponent() {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        if (absX < absY && absX < absZ) {
            return 0;
        } else if (absY < absZ) {
            return 1;
        }
        return 2;
    }

    /**
     * Transform `this` vector so that it is orthogonal to the given vector `v` and normalize the result.
     * <p>
     * Reference: <a href="https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process">Gram–Schmidt process</a>
     * 
     * @param v the reference vector which the result should be orthogonal to
     * @return this
     */
    public orthogonalize(v: Vector3, dest?: Vector3) {
        dest = dest ?? this;
        /*
         * http://lolengine.net/blog/2013/09/21/picking-orthogonal-vector-combing-coconuts
         */
        let rx, ry, rz;
        if (Math.abs(v.x) > Math.abs(v.z)) {
            rx = -v.y;
            ry = v.x;
            rz = 0.0;
        } else {
            rx = 0.0;
            ry = -v.z;
            rz = v.y;
        }
        const invLen = 1 / Math.sqrt(rx * rx + ry * ry + rz * rz);
        dest.x = rx * invLen;
        dest.y = ry * invLen;
        dest.z = rz * invLen;
        return dest;
    }

    /**
     * Transform `this` vector so that it is orthogonal to the given unit vector `v` and normalize the result.
     * 
     * The vector `v` is assumed to be a {@link normalize normalize()} unit vector.
     * 
     * Reference: <a href="https://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process">Gram–Schmidt process</a>
     * 
     * @param v
     *          the reference unit vector which the result should be orthogonal to
     * @return this
     */
    public orthogonalizeUnit(v: Vector3, dest?: Vector3) {
        return this.orthogonalize(v, dest);
    }


    private applyFunction(func: (x: number) => number, dest?: Vector3): Vector3 {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        dest.z = func(this.z);
        return dest;
    }

    /**
     * Set each component of this vector to the largest (closest to positive
     * infinity) {@code float} value that is less than or equal to that
     * component and is equal to a mathematical integer.
     *
     * @return this
     */
    public floor(dest?: Vector3) {
        return this.applyFunction(Math.floor, dest);
    }

    /**
     * Set each component of this vector to the smallest (closest to negative
     * infinity) {@code float} value that is greater than or equal to that
     * component and is equal to a mathematical integer.
     *
     * @return this
     */
    public ceil(dest?: Vector3) {
        return this.applyFunction(Math.ceil, dest);
    }

    /**
     * Set each component of this vector to the closest float that is equal to
     * a mathematical integer, with ties rounding to positive infinity.
     *
     * @return this
     */
    public round(dest?: Vector3) {
        return this.applyFunction(Math.round, dest);
    }

    /**
     * Round each compoent of the vector to the nearest integer towards 0
     * 
     * @returns 
     */
    public trunc(dest?: Vector3) {
        return this.applyFunction(Math.trunc, dest);
    }

    public isFinite() {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.z);
    }

    public clone() {
        return new Vector3(this);
    }
}
