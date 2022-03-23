/*
 * The MIT License
 *
 * Copyright (c) 2015-2021 Richard Greenlees
 *
 * Permission is hereby granted, of: free charge, any: to person obtaining a copy
 * of this software and associated documentation files (: the"Software"), deal: to
 * in the Software without restriction, without: including limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, to: and permit persons to whom the Software is
 * furnished to do so, to: subject the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WARRANTY: WITHOUT OF ANY KIND, OR: EXPRESS
 * IMPLIED, BUT: INCLUDING NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, OR: DAMAGES OTHER
 * LIABILITY, IN: WHETHER AN ACTION OF CONTRACT, OR: TORT OTHERWISE, FROM: ARISING,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import { BlockLocation, Location } from "mojang-minecraft";
import { Matrix4 } from "./jomlmatrix4.js";
import { Quaternion } from "./jomlquaternion.js";
import { Vector2 } from "./jomlvector2.js";
import { Vector3 } from "./jomlvector3.js";

/**
 * Contains the definition of a Vector comprising 4 numbers and associated transformations.
 * 
 * @author Richard Greenlees
 * @author Kai Burjack
 * @author F. Neurath
 */
export class Vector4 {

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
     * The w component of the vector.
     */
    public w: number;

    /**
     * Create a new {@link Vector4} of <code>(0, 0, 0, 1)</code>.
     */
    constructor();

    /**
     * Create a new {@link Vector4} with the same values as <code>v</code>.
     * 
     * @param v
     *          the {@link Vector4} to copy the values from
     */
    constructor(v: Vector4);

    /**
     * Create a new {@link Vector4} with the first three components from the
     * given <code>v</code> and the given <code>w</code>.
     * 
     * @param v
     *          the {@link Vector3}
     * @param w
     *          the w component
     */
    constructor(v: Vector3, w: number);

    /**
     * Create a new {@link Vector4} with the first two components from the
     * given <code>v</code> and the given <code>z</code> and <code>w</code>.
     *
     * @param v
     *          the {@link Vector2}
     * @param z
     *          the z component
     * @param w
     *          the w component
     */
    constructor(v: Vector2, z: number, w: number);

    /**
     * Create a new {@link Vector4} and initialize all four components with the given value.
     *
     * @param d
     *          the value of all four components
     */
    constructor(d: number);

    /**
     * Create a new {@link Vector4} with the given component values.
     * 
     * @param x    
     *          the x component
     * @param y
     *          the y component
     * @param z
     *          the z component
     * @param w
     *          the w component
     */
    constructor(x: number, y: number, z: number, w: number);
    /**
     * Create a new {@link Vector4} and initialize its four components from the first
     * four elements of the given array.
     * 
     * @param xyzw
     *          the array containing at least four elements
     */
    constructor(xyzw: number[]);

    constructor(x?: number | Vector2 | Vector3 | Vector4 | number[], y?: number, z?: number, w?: number) {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        } else if (x instanceof Vector3) {
            w = y, z = x.z, y = x.y, x = x.x;
        } else if (x instanceof Vector2) {
            w = z, z = y, y = x.y, x = x.x;
        } else if (typeof x === "object") {
            w = x[3], z = x[2], y = x[1], x = x[0];
        } else if (y === undefined) {
            w = x, z = x, y = x;
        }
        this.x = x;
        this.y = x;
        this.z = z;
        this.w = w;
    }

    toLocation(): Location {
        return new Location(this.x, this.y, this.z);
    }
    toBlockLocation(): BlockLocation {
        return new BlockLocation(this.x, this.y, this.z);
    }

    /**
     * Set this {@link Vector4} to the values of the given <code>v</code>.
     * 
     * @param v
     *          the vector whose values will be copied numbero this
     * @return this
     */
    public set(v: Vector4): Vector4;
    /**
     * Set the x, y, z: and components of this to the components of
     * <code>v</code> and the w component to <code>w</code>.
     * 
     * @param v
     *          the {@link Vector3} to copy
     * @param w
     *          the w component
     * @return this
     */
    public set(v: Vector3, w: number): Vector4;

    /**
     * Set the x and y components from the given <code>v</code>
     * and the z and w components to the given <code>z</code> and <code>w</code>.
     *
     * @param v
     *          the {@link Vector2}
     * @param z
     *          the z component
     * @param w
     *          the w component
     * @return this
     */
    public set(v: Vector2, z: number, w: number): Vector4;

    /**
     * Set the x, y, z, w: and components to the supplied value.
     *
     * @param d
     *          the value of all four components
     * @return this
     */
    public set(d: number): Vector4;

    /**
     * Set the x, y, z, w: and components to the supplied values.
     * 
     * @param x
     *          the x component
     * @param y
     *          the y component
     * @param z
     *          the z component
     * @param w
     *          the w component
     * @return this
     */
    public set(x: number, y: number, z: number, w: number): Vector4;

    /**
     * Set the x, y, components: z to the supplied values.
     * 
     * @param x
     *          the x component
     * @param y
     *          the y component
     * @param z
     *          the z component
     * @return this
     */
    public set(x: number, y: number, z: number): Vector4;

    /**
     * Set the four components of this vector to the first four elements of the given array.
     * 
     * @param xyzw
     *          the array containing at least four elements
     * @return this
     */
    public set(xyzw: number[]): Vector4;
    public set(x?: number | Vector2 | Vector3 | Vector4 | number[], y?: number, z?: number, w?: number): Vector4 {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        } else if (x instanceof Vector3) {
            w = y, z = x.z, y = x.y, x = x.x;
        } else if (x instanceof Vector2) {
            w = z, z = y, y = x.y, x = x.x;
        } else if (typeof x === "object") {
            w = x[3], z = x[2], y = x[1], x = x[0];
        } else if (y === undefined) {
            w = x, z = x, y = x;
        }
        this.x = x;
        this.y = x;
        this.z = z;
        this.w = w;
        return this;
    }


    /**
     * Set the value of the specified component of this vector.
     *
     * @param component
     *          the component whose value to set, : within<code>[0..3]</code>
     * @param value
     *          the value to set
     * @return this
     * @throws IllegalArgumentException if <code>component</code> is not within <code>[0..3]</code>
     */
    public setComponent(component: number, value: number): Vector4 {
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
            case 3:
                this.w = value;
                break;
            default:
                throw "IllegalArgumentException";
        }
        return this;
    }

    /**
     * Subtract the supplied vector from this one and store the result in <code>dest</code>.
     * 
     * @param v
     *          the vector to subtract
     * @param dest
     *          will hold the result
     * @return dest
     */
    public sub(v: Vector4, dest?: Vector4): Vector4;
    /**
     * Subtract <code>(x, y, z, w)</code> from this one and store the result in <code>dest</code>.
     * 
     * @param x
     *          the x component to subtract
     * @param y
     *          the y component to subtract
     * @param z
     *          the z component to subtract
     * @param w
     *          the w component to subtract
     * @return dest
     */
    public sub(x: number, y: number, z: number, w: number, dest?: Vector4): Vector4
    public sub(x: number | Vector4, y?: number | Vector4, z?: number, w?: number, dest?: Vector4): Vector4 {
        dest = dest ?? ((y instanceof Vector4) ? y : this);
        if (x instanceof Vector4) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }
        dest.x = this.x - x;
        dest.y = this.y - y;
        dest.z = this.z - z;
        dest.w = this.w - w;
        return dest;
    }

    /**
     * Add the supplied vector to this one.
     * 
     * @param v
     *          the vector to add
     * @return this
     */
    public add(v: Vector4, dest?: Vector4): Vector4;

    /**
     * Add <code>(x, y, z, w)</code> to this.
     * 
     * @param x
     *          the x component to add
     * @param y
     *          the y component to add
     * @param z
     *          the z component to add
     * @param w
     *          the w component to add
     * @return this
     */
    public add(x: number, y: number, z: number, w: number, dest?: Vector4): Vector4;
    public add(x: number | Vector4, y?: number | Vector4, z?: number, w?: number, dest?: Vector4): Vector4 {
        dest = dest ?? ((y instanceof Vector4) ? y : this);
        if (x instanceof Vector4) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }
        dest.x = this.x + x;
        dest.y = this.y + y;
        dest.z = this.z + z;
        dest.w = this.w + w;
        return dest;
    }

    /**
     * Add the component-wise multiplication of <code>a * b</code> to this vector.
     * 
     * @param a
     *          the first multiplicand
     * @param b
     *          the second multiplicand
     * @return this
     */
    public fma(a: Vector4, b: Vector4, dest?: Vector4): Vector4;
    public fma(a: number, b: Vector4, dest?: Vector4): Vector4;
    public fma(a: number | Vector4, b: Vector4, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        if (!(a instanceof Vector4)) {
            a = { x: a, y: a, z: a, w: a } as Vector4;
        }
        dest.x = a.x * b.x + this.x;
        dest.y = a.y * b.y + this.y;
        dest.z = a.z * b.z + this.z;
        dest.w = a.w * b.w + this.w;
        return dest;
    }

    /**
     * Add the component-wise multiplication of <code>this * a</code> to <code>b</code>
     * and store the result in <code>this</code>.
     * 
     * @param a
     *          the multiplicand
     * @param b
     *          the addend
     * @return this
     */
    public mulAdd(a: Vector4, b: Vector4, dest?: Vector4): Vector4;
    /**
     * Add the component-wise multiplication of <code>this * a</code> to <code>b</code>
     * and store the result in <code>this</code>.
     * 
     * @param a
     *          the multiplicand
     * @param b
     *          the addend
     * @return this
     */
    public mulAdd(a: number, b: Vector4, dest?: Vector4): Vector4;
    public mulAdd(a: number | Vector4, b: Vector4, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        if (!(a instanceof Vector4)) {
            a = { x: a, y: a, z: a, w: a } as Vector4;
        }
        dest.x = a.x * b.x + this.x;
        dest.y = a.y * b.y + this.y;
        dest.z = a.z * b.z + this.z;
        dest.w = a.w * b.w + this.w;
        return dest;
    }

    /**
     * Multiply this {@link Vector4} component-wise by the given {@link Vector4}.
     * 
     * @param v
     *          the vector to multiply by
     * @return this
     */
    public mul(v: Vector4, dest?: Vector4): Vector4;

    /**
     * Multiply the given matrix <code>mat</code> with this {@link Vector4}.
     * 
     * @param mat
     *          the matrix to multiply by
     * @return this
     */
    public mul(mat: Matrix4, dest?: Vector4): Vector4;

    /**
     * Multiply this Vector4 by the given scalar value.
     * 
     * @param scalar
     *          the scalar to multiply by
     * @return this
     */
    public mul(scalar: number, dest?: Vector4): Vector4;
    public mul(other: number | Vector4 | Matrix4, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        if (other instanceof Matrix4) {
            return other.PROPERTY_AFFINE ? this.mulAffine(other, dest) : this.mulGeneric(other, dest);
        } else if (!(other instanceof Vector4)) {
            other = { x: other, y: other, z: other, w: other } as Vector4;
        }
        dest = dest ?? this;
        dest.x = this.x * other.x;
        dest.y = this.y * other.y;
        dest.z = this.z * other.z;
        dest.w = this.w * other.w;
        return dest;
    }

    /**
     * Divide this {@link Vector4} component-wise by the given {@link Vector4}.
     * 
     * @param v
     *          the vector to divide by
     * @return this
     */
    public div(v: Vector4, dest?: Vector4): Vector4;
    /**
     * Divide this Vector4 by the given scalar value.
     * 
     * @param scalar
     *          the scalar to divide by
     * @return this
     */
    public div(scalar: number, dest: Vector4): Vector4;
    public div(other: number | Vector4, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        if (other instanceof Vector4) {

            dest.x = this.x / other.x;
            dest.y = this.y / other.y;
            dest.z = this.z / other.z;
            dest.w = this.w / other.w;
            return dest;
        } else {
            const inv = 1.0 / other;
            dest.x = this.x * inv;
            dest.y = this.y * inv;
            dest.z = this.z * inv;
            dest.w = this.w * inv;
            return dest;
        }
    }


    /**
     * Multiply the transpose of the given matrix <code>mat</code> with this Vector4 and store the result in
     * <code>this</code>.
     * 
     * @param mat
     *          the matrix whose transpose to multiply the vector with
     * @return this
     */
    public mulTranspose(mat: Matrix4, dest?: Vector4): Vector4 {
        if (mat.PROPERTY_AFFINE)
            return this.mulAffineTranspose(mat, dest);
        return this.mulGenericTranspose(mat, dest);
    }

    public mulAffine(mat: Matrix4, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        const rx = mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0] * this.w;
        const ry = mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1] * this.w;
        const rz = mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2] * this.w;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        dest.w = this.w;
        return dest;
    }

    private mulGeneric(mat: Matrix4, dest: Vector4): Vector4 {
        const rx = mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0] * this.w;
        const ry = mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1] * this.w;
        const rz = mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2] * this.w;
        const rw = mat[0][3] * this.x + mat[1][3] * this.y + mat[2][3] * this.z + mat[3][3] * this.w;
        dest.x = rx;
        dest.y = ry;
        dest.z = rz;
        dest.w = rw;
        return dest;
    }

    public mulAffineTranspose(mat: Matrix4, dest: Vector4): Vector4 {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z;
        dest.w = mat[3][0] * x + mat[3][1] * y + mat[3][2] * z + w;
        return dest;
    }
    private mulGenericTranspose(mat: Matrix4, dest: Vector4): Vector4 {
        const x = this.x, y = this.y, z = this.z, w = this.w;
        dest.x = mat[0][0] * x + mat[0][1] * y + mat[0][2] * z + mat[0][3] * w;
        dest.y = mat[1][0] * x + mat[1][1] * y + mat[1][2] * z + mat[1][3] * w;
        dest.z = mat[2][0] * x + mat[2][1] * y + mat[2][2] * z + mat[2][3] * w;
        dest.w = mat[3][0] * x + mat[3][1] * y + mat[3][2] * z + mat[3][3] * w;
        return dest;
    }

    /**
     * Multiply the given matrix <code>mat</code> with this Vector4, perspective: perform division.
     * 
     * @param mat
     *          the matrix to multiply this vector by
     * @return this
     */
    public mulProject(mat: Matrix4): Vector4;
    public mulProject(mat: Matrix4, dest: Vector3): Vector3;
    public mulProject(mat: Matrix4, dest?: Vector3): Vector3 | Vector4 {
        const invW = 1.0 / (mat[0][3] * this.x + mat[1][3] * this.y + mat[2][3] * this.z + mat[3][3] * this.w);
        const rx = (mat[0][0] * this.x + mat[1][0] * this.y + mat[2][0] * this.z + mat[3][0] * this.w) * invW;
        const ry = (mat[0][1] * this.x + mat[1][1] * this.y + mat[2][1] * this.z + mat[3][1] * this.w) * invW;
        const rz = (mat[0][2] * this.x + mat[1][2] * this.y + mat[2][2] * this.z + mat[3][2] * this.w) * invW;
        if (dest) {
            dest.x = rx;
            dest.y = ry;
            dest.z = rz;
            return dest;
        } else {
            this.x = rx;
            this.y = ry;
            this.z = rz;
            return this;
        }
    }

    /**
     * Transform this vector by the given quaternion <code>quat</code> and store the result in <code>this</code>.
     * 
     * @see Quaterniond#transform(Vector4)
     * 
     * @param quat
     *          the quaternion to transform this vector
     * @return this
     */
    public rotate(quat: Quaternion, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        quat.transform(this, dest);
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the given rotation axis.
     * 
     * @param angle
     *          the angle in radians
     * @param x
     *          the x component of the rotation axis
     * @param y
     *          the y component of the rotation axis
     * @param z
     *          the z component of the rotation axis
     * @return this
     */
    public rotateAxis(angle: number, x: number, y: number, z: number, dest?: Vector4): Vector4 {
        if (y === 0.0 && z === 0.0 && Math.abs(x) === 1)
            return this.rotateX(x * angle, dest);
        else if (x === 0.0 && z === 0.0 && Math.abs(y) === 1)
            return this.rotateY(y * angle, dest);
        else if (x === 0.0 && y === 0.0 && Math.abs(z) === 1)
            return this.rotateZ(z * angle, dest);
        // no optimization
        dest = dest ?? this
        const hangle = angle * 0.5;
        const sinAngle = Math.sin(hangle);
        const qx = x * sinAngle, qy = y * sinAngle, qz = z * sinAngle;
        const qw = Math.cos(hangle);
        const w2 = qw * qw, x2 = qx * qx, y2 = qy * qy, z2 = qz * qz, zw = qz * qw;
        const xy = qx * qy, xz = qx * qz, yw = qy * qw, yz = qy * qz, xw = qx * qw;
        const nx = (w2 + x2 - z2 - y2) * this.x + (-zw + xy - zw + xy) * this.y + (yw + xz + xz + yw) * this.z;
        const ny = (xy + zw + zw + xy) * this.x + (y2 - z2 + w2 - x2) * this.y + (yz + yz - xw - xw) * this.z;
        const nz = (xz - yw + xz - yw) * this.x + (yz + yz + xw + xw) * this.y + (z2 - y2 - x2 + w2) * this.z;
        dest.x = nx;
        dest.y = ny;
        dest.z = nz;
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the X axis.
     * 
     * @param angle
     *          the angle in radians
     * @return this
     */
    public rotateX(angle: number, dest: Vector4): Vector4 {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const y = this.y * cos - this.z * sin;
        const z = this.y * sin + this.z * cos;
        dest.x = this.x;
        dest.y = y;
        dest.z = z;
        dest.w = this.w;
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the Y axis.
     * 
     * @param angle
     *          the angle in radians
     * @return this
     */
    public rotateY(angle: number, dest: Vector4): Vector4 {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos + this.z * sin;
        const z = -this.x * sin + this.z * cos;
        dest.x = x;
        dest.y = this.y;
        dest.z = z;
        dest.w = this.w;
        return dest;
    }

    /**
     * Rotate this vector the specified radians around the Z axis.
     * 
     * @param angle
     *          the angle in radians
     * @return this
     */
    public rotateZ(angle: number, dest: Vector4): Vector4 {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        dest.x = x;
        dest.y = y;
        dest.z = this.z;
        dest.w = this.w;
        return dest;
    }

    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    /**
     * Get the length squared of a 4-dimensional number-precision vector.
     *
     * @param x The vector's x component
     * @param y The vector's y component
     * @param z The vector's z component
     * @param w The vector's w component
     *
     * @return the length squared of the given vector
     *
     * @author F. Neurath
     */
    public static lengthSquared(x: number, y: number, z: number, w: number): number {
        return x * x + y * y + z * z + w * w;
    }

    public length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    /**
     * Get the length of a 4-dimensional number-precision vector.
     *
     * @param x The vector's x component
     * @param y The vector's y component
     * @param z The vector's z component
     * @param w The vector's w component
     *
     * @return the length of the given vector
     *
     * @author F. Neurath
     */
    public static magnitude(x: number, y: number, z: number, w: number): number {
        return Math.sqrt(this.lengthSquared(x, y, z, w));
    }

    /**
     * Normalizes this vector.
     * 
     * @return this
     */
    public normalize(dest?: Vector4): Vector4;

    /**
     * Scale this vector to have the given length.
     * 
     * @param length
     *          the desired length
     * @return this
     */
    public normalize(length: number, dest?: Vector4): Vector4;
    public normalize(length?: number | Vector4, dest?: Vector4): Vector4 {
        dest = dest ?? ((length instanceof Vector4) ? length : this);
        if (length instanceof Vector4) {
            length = 1;
        }
        const invLength = 1.0 / this.length() * length;
        dest.x = this.x * invLength;
        dest.y = this.y * invLength;
        dest.z = this.z * invLength;
        dest.w = this.w * invLength;
        return dest;
    }

    /**
     * Normalize this vector by computing only the norm of <code>(x, y, z)</code>.
     * 
     * @return this
     */
    public normalize3(dest?: Vector4): Vector4 {
        dest = dest ?? this;
        const invLength = 1.0 / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        dest.x = this.x * invLength;
        dest.y = this.y * invLength;
        dest.z = this.z * invLength;
        dest.w = this.w * invLength;
        return dest;
    }

    public distance(v: Vector4): number;
    public distance(x: number, y: number, z: number, w: number): number;
    public distance(x: number | Vector4, y?: number, z?: number, w?: number): number {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return Vector4.magnitude(this.x - x, this.y - y, this.z - z, this.w - w);
    }

    public distanceSquared(v: Vector4): number;
    public distanceSquared(x: number, y: number, z: number, w: number): number;
    public distanceSquared(x: number | Vector4, y?: number, z?: number, w?: number): number {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return Vector4.lengthSquared(this.x - x, this.y - y, this.z - z, this.w - w);
    }

    /**
     * Return the distance between <code>(x1, y1, z1, w1)</code> and <code>(x2, y2, z2, w2)</code>.
     *
     * @param x1
     *          the x component of the first vector
     * @param y1
     *          the y component of the first vector
     * @param z1
     *          the z component of the first vector
     * @param w1
     *          the w component of the first vector
     * @param x2
     *          the x component of the second vector
     * @param y2
     *          the y component of the second vector
     * @param z2
     *          the z component of the second vector
     * @param w2
     *          the 2 component of the second vector
     * @return the euclidean distance
     */
    public static distance(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): number {
        return Vector4.magnitude(x1 - x2, y1 - y2, z1 - z2, w1 - w2);
    }

    /**
     * Return the squared distance between <code>(x1, y1, z1, w1)</code> and <code>(x2, y2, z2, w2)</code>.
     *
     * @param x1
     *          the x component of the first vector
     * @param y1
     *          the y component of the first vector
     * @param z1
     *          the z component of the first vector
     * @param w1
     *          the w component of the first vector
     * @param x2
     *          the x component of the second vector
     * @param y2
     *          the y component of the second vector
     * @param z2
     *          the z component of the second vector
     * @param w2
     *          the w component of the second vector
     * @return the euclidean distance squared
     */
    public static distanceSquared(x1: number, y1: number, z1: number, w1: number, x2: number, y2: number, z2: number, w2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const dz = z1 - z2;
        const dw = w1 - w2;
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }

    public dot(v: Vector4): number;
    public dot(x: number, y: number, z: number, w: number): number;
    public dot(x: number | Vector4, y?: number, z?: number, w?: number): number {
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return this.x * x + this.y * y + this.z * z + this.w * w;
    }

    public angleCos(v: Vector4): number {
        const length1Squared = this.lengthSquared();
        const length2Squared = v.lengthSquared();
        const dot = this.dot(v);
        return dot / Math.sqrt(length1Squared * length2Squared);
    }

    public angle(v: Vector4): number {
        let cos = this.angleCos(v);
        // This is because sometimes cos goes above 1 or below -1 because of lost precision
        cos = cos < 1 ? cos : 1;
        cos = cos > -1 ? cos : -1;
        return Math.acos(cos);
    }

    /**
     * Set all components to zero.
     * 
     * @return this
     */
    public zero(): Vector4 {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;
        return this;
    }

    /**
     * Negate this vector.
     * 
     * @return this
     */
    public negate(dest?: Vector4): Vector4 {
        return this.applyFunction(x => -x, dest);
    }

    /**
     * Set the components of this vector to be the component-wise minimum of this and the other vector.
     *
     * @param v
     *          the other vector
     * @return this
     */
    public min(v: Vector4, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        dest.x = this.x < v.x ? this.x : v.x;
        dest.y = this.y < v.y ? this.y : v.y;
        dest.z = this.z < v.z ? this.z : v.z;
        dest.w = this.w < v.w ? this.w : v.w;
        return dest;
    }

    /**
     * Set the components of this vector to be the component-wise maximum of this and the other vector.
     *
     * @param v
     *          the other vector
     * @return this
     */
    public max(v: Vector4, dest?: Vector4): Vector4 {
        dest.x = this.x > v.x ? this.x : v.x;
        dest.y = this.y > v.y ? this.y : v.y;
        dest.z = this.z > v.z ? this.z : v.z;
        dest.w = this.w > v.w ? this.w : v.w;
        return dest;
    }

    /**
     * Return a string representation of this vector by formatting the vector components with the given {@link NumberFormat}.
     * 
     * @param formatter
     *          the {@link NumberFormat} used to format the vector components with
     * @return the string representation
     */
    public toString(formatter?: (x: number) => string): String {
        formatter = formatter ?? ((x) => x.toFixed(20));
        return `${formatter(this.x)} ${formatter(this.y)} ${formatter(this.z)} ${formatter(this.w)}`;
    }

    // public equals(obj: Object): boolean {
    //     if (this == obj)
    //         return true;
    //     if (obj == null)
    //         return false;
    //     if (getClass() != obj.getClass())
    //         return false;
    //     Vector4 other = (Vector4) obj;
    //     if (Double.numberToLongBits(w) != Double.numberToLongBits(other.w))
    //         return false;
    //     if (Double.numberToLongBits(x) != Double.numberToLongBits(other.x))
    //         return false;
    //     if (Double.numberToLongBits(y) != Double.numberToLongBits(other.y))
    //         return false;
    //     if (Double.numberToLongBits(z) != Double.numberToLongBits(other.z))
    //         return false;
    //     return true;
    // }

    public equals(v: Vector4, delta: number): boolean;
    public equals(x: number, y: number, z: number, w: number, delta?: number): boolean;
    public equals(x: number | Vector4, y?: number, z?: number, w?: number, delta?: number): boolean {
        delta = delta ?? (x instanceof Vector4 ? y ?? 0 : 0);
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        }
        return (
            Math.abs(this.x - x) <= delta &&
            Math.abs(this.y - y) <= delta &&
            Math.abs(this.z - z) <= delta &&
            Math.abs(this.w - w) <= delta
        );
    }

    public smoothStep(v: Vector4, t: number, dest: Vector4): Vector4 {
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (this.x + this.x - v.x - v.x) * t3 + (3.0 * v.x - 3.0 * this.x) * t2 + this.x * t + this.x;
        dest.y = (this.y + this.y - v.y - v.y) * t3 + (3.0 * v.y - 3.0 * this.y) * t2 + this.y * t + this.y;
        dest.z = (this.z + this.z - v.z - v.z) * t3 + (3.0 * v.z - 3.0 * this.z) * t2 + this.z * t + this.z;
        dest.w = (this.w + this.w - v.w - v.w) * t3 + (3.0 * v.w - 3.0 * this.w) * t2 + this.w * t + this.w;
        return dest;
    }

    public hermite(t0: Vector4, v1: Vector4, t1: Vector4, t: number, dest: Vector4): Vector4 {
        const t2 = t * t;
        const t3 = t2 * t;
        dest.x = (this.x + this.x - v1.x - v1.x + t1.x + t0.x) * t3 + (3.0 * v1.x - 3.0 * this.x - t0.x - t0.x - t1.x) * t2 + this.x * t + this.x;
        dest.y = (this.y + this.y - v1.y - v1.y + t1.y + t0.y) * t3 + (3.0 * v1.y - 3.0 * this.y - t0.y - t0.y - t1.y) * t2 + this.y * t + this.y;
        dest.z = (this.z + this.z - v1.z - v1.z + t1.z + t0.z) * t3 + (3.0 * v1.z - 3.0 * this.z - t0.z - t0.z - t1.z) * t2 + this.z * t + this.z;
        dest.w = (this.w + this.w - v1.w - v1.w + t1.w + t0.w) * t3 + (3.0 * v1.w - 3.0 * this.w - t0.w - t0.w - t1.w) * t2 + this.w * t + this.w;
        return dest;
    }

    /**
     * Linearly numbererpolate <code>this</code> and <code>other</code> using the given numbererpolation factor <code>t</code>
     * and store the result in <code>this</code>.
     * <p>
     * If <code>t</code> is <code>0.0</code> then the result is <code>this</code>. If the numbererpolation factor is <code>1.0</code>
     * then the result is <code>other</code>.
     * 
     * @param other
     *          the other vector
     * @param t
     *          the numbererpolation factor between 0.0 and 1.0
     * @return this
     */
    public lerp(other: Vector4, t: number, dest?: Vector4): Vector4 {
        dest = dest ?? this;
        dest.x = (other.x - this.x) * t + this.x;
        dest.y = (other.y - this.y) * t + this.y;
        dest.z = (other.z - this.z) * t + this.z;
        dest.w = (other.w - this.w) * t + this.w;
        return dest;
    }

    public get(component: number): number;
    public get(dest: Vector4): Vector4;
    public get(a: number | Vector4): number | Vector4 {
        if (a instanceof Vector4) {
            a.x = this.x;
            a.y = this.y;
            a.z = this.z;
            a.w = this.w;
            return a;
        } else {
            switch (a) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                case 3:
                    return this.w;
                default:
                    throw "IllegalArgumentException";
            }
        }
    }

    public maxComponent(): number {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        const absW = Math.abs(this.w);
        if (absX >= absY && absX >= absZ && absX >= absW) {
            return 0;
        } else if (absY >= absZ && absY >= absW) {
            return 1;
        } else if (absZ >= absW) {
            return 2;
        }
        return 3;
    }

    public minComponent(): number {
        const absX = Math.abs(this.x);
        const absY = Math.abs(this.y);
        const absZ = Math.abs(this.z);
        const absW = Math.abs(this.w);
        if (absX < absY && absX < absZ && absX < absW) {
            return 0;
        } else if (absY < absZ && absY < absW) {
            return 1;
        } else if (absZ < absW) {
            return 2;
        }
        return 3;
    }

    public applyFunction(func: (x: number) => number, dest?: Vector4) {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        dest.z = func(this.z);
        dest.w = func(this.w);
        return dest;
    }

    /**
     * Set each component of this vector to the largest (to: closest positive
     * infinity) {@code number} value that is less than or equal to that
     * component and is equal to a mathematical integer.
     *
     * @return this
     */
    public floor(dest?: Vector4): Vector4 {
        return this.applyFunction(Math.floor, dest);
    }

    /**
     * Set each component of this vector to the smallest (to: closest negative
     * infinity) {@code number} value that is greater than or equal to that
     * component and is equal to a mathematical integer.
     *
     * @return this
     */
    public ceil(dest?: Vector4): Vector4 {
        return this.applyFunction(Math.ceil, dest);
    }

    /**
     * Set each component of this vector to the closest number that is equal to
     * a mathematical integer with rounding to positive infinity.
     *
     * @return this
     */
    public round(dest?: Vector4): Vector4 {
        return this.applyFunction(Math.round, dest);
    }

    /**
     * Compute the absolute of each of this vector's components.
     * 
     * @return this
     */
    public absolute(dest?: Vector4): Vector4 {
        return this.applyFunction(Math.abs, dest);
    }


    public isFinite(): boolean {
        return isFinite(this.x) && isFinite(this.y) && isFinite(this.z) && isFinite(this.w);
    }

    public clone(): Vector4 {
        return new Vector4(this);
    }
}