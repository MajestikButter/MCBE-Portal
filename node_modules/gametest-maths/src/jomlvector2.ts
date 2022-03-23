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

import { Matrix3 } from "./matrix3";


export class Matrix2 {
    m00: number; m01: number;
    m10: number; m11: number;
}

type Vector2Like = {
    x: number;
    y: number;
}

/**
 * Represents a 2D vector with single-precision.
 *
 * @author RGreenlees
 * @author Kai Burjack
 * @author F. Neurath
 */
export class Vector2 {

    /**
     * The x component of the vector.
     */
    public x: number;
    /**
     * The y component of the vector.
     */
    public y: number;

    /**
     * Create a new {@link Vector2} and initialize its components to zero.
     */
    constructor();

    /**
     * Create a new {@link Vector2} and initialize both of its components with the given value.
     *
     * @param d
     *        the value of both components
     */
    constructor(d: number);

    /**
     * Create a new {@link Vector2} and initialize its components to the given values.
     * 
     * @param x
     *        the x component
     * @param y
     *        the y component
     */
    constructor(x: number, y: number);

    /**
     * Create a new {@link Vector2} and initialize its components to the one of the given vector.
     * 
     * @param v
     *        the {@link Vector2c} to copy the values from
     */
    constructor(v: Vector2Like);

    /**
     * Create a new {@link Vector2} and initialize its two components from the first
     * two elements of the given array.
     * 
     * @param xy
     *          the array containing at least two elements
     */
    // public constructor(xy: number[]) {
    //     this.x = xy[0];
    //     this.y = xy[1];
    // }
    constructor(x?: number | Vector2Like, y?: number) {
        if (x === undefined) {              // ()
            y = 0, x = 0;
        } else if (typeof x === 'object') { // (v: IVector3)
            y = x.y, x = x.x;
        } else if (y == undefined) {        // (d: number)
            y = x, x = x;
        }                                   // (x: number, y: number, z: number)

        this.x = x;
        this.y = y;
    }

    /**
     * Set the x and y components to the supplied value.
     *
     * @param d
     *        the value of both components
     * @return this
     */
    public set(d: number): Vector2;

    /**
     * Set the x and y components to the supplied values.
     * 
     * @param x
     *        the x component
     * @param y
     *        the y component
     * @return this
     */
    public set(x: number, y: number): Vector2;

    /**
     * Set this {@link Vector2} to the values of v.
     * 
     * @param v
     *        the vector to copy from
     * @return this
     */
    public set(v: Vector2): Vector2;

    /**
     * Set the two components of this vector to the first two elements of the given array.
     * 
     * @param xy
     *          the array containing at least two elements
     * @return this
     */
    // public set(xy: number[]): Vector2 {
    //     this.x = xy[0];
    //     this.y = xy[1];
    //     return this;
    // }
    public set(x?: number | Vector2Like, y?: number) {
        if (x === undefined) {              // ()
            y = 0, x = 0;
        } else if (typeof x === 'object') { // (v: IVector3)
            y = x.y, x = x.x;
        } else if (y == undefined) {        // (d: number)
            y = x, x = x;
        }                                   // (x: number, y: number, z: number)

        this.x = x;
        this.y = y;
        return this;
    }

    public get(component: number): number;
    public get(mode: ((x: number) => number), dest: Vector2): Vector2;
    public get(dest: Vector2): Vector2;
    public get(mode: number | Vector2 | ((x: number) => number), dest?: Vector2): Vector2 | number {
        if (typeof mode === "number") { // (component: number)
            switch (mode) {
                case 0:
                    return this.x;
                case 1:
                    return this.y;
                default:
                    throw new Error("IllegalArgumentException");
            }
        }
        if (mode instanceof Vector2) {
            dest = mode;
            mode = (x) => x;
        }
        return this.applyFunction(mode, dest);
    }

    /**
     * Set the value of the specified component of this vector.
     *
     * @param component
     *          the component whose value to set, : within<code>[0..1]</code>
     * @param value
     *          the value to set
     * @return this
     * @throws IllegalArgumentException if <code>component</code> is not within <code>[0..1]</code>
     */
    public setComponent(component: number, value: number): Vector2 {
        switch (component) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default:
                throw new Error("IllegalArgumentException");
        }
        return this;
    }

    /**
     * Set this vector to be one of its perpendicular vectors.
     * 
     * @return this
     */
    public perpendicular(): Vector2 {
        const xTemp: number = this.y;
        this.y = this.x * -1;
        this.x = xTemp;
        return this;
    }

    /**
     * Subtract <code>v</code> from this vector.
     * 
     * @param v
     *          the vector to subtract
     * @return this
     */
    public sub(v: Vector2, dest?: Vector2): Vector2;

    /**
     * Subtract <code>(x, y)</code> from this vector.
     * 
     * @param x
     *          the x component to subtract
     * @param y
     *          the y component to subtract
     * @return this
     */
    public sub(x: number, y: number, dest?: Vector2): Vector2;
    public sub(x: number | Vector2, y: number | Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? (y instanceof Vector2 ? y : this);
        if (x instanceof Vector2) {
            y = x.y, x = x.x;
        } else {
            y = y as number;
        }
        dest.x = this.x - x;
        dest.y = this.y - y;
        return dest;
    }

    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    public angle(v: Vector2): number {
        const dot = this.x * v.x + this.y * v.y;
        const det = this.x * v.y - this.y * v.x;
        return Math.atan2(det, dot);
    }

    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Get the length squared of a 2-dimensional single-precision vector.
     *
     * @param x The vector's x component
     * @param y The vector's y component
     *
     * @return the length squared of the given vector
     *
     * @author F. Neurath
     */
    public static lengthSquared(x: number, y: number): number {
        return x * x + y * y;
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get the length of a 2-dimensional single-precision vector.
     *
     * @param x The vector's x component
     * @param y The vector's y component
     *
     * @return the length of the given vector
     *
     * @author F. Neurath
     */
    // public static length(x: number, y: number): number {
    //     return Math.sqrt(x * x + y * y);
    // }

    public distance(v: Vector2): number;
    public distance(x: number, y: number): number;
    public distance(x: number | Vector2, y?: number): number {
        if (x instanceof Vector2) {
            y = x.y, x = x.x;
        }
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public distanceSquared(v: Vector2): number;
    public distanceSquared(x: number, y: number): number;
    public distanceSquared(x: number | Vector2, y?: number): number {
        if (x instanceof Vector2) {
            y = x.y, x = x.x;
        }
        const dx = this.x - x;
        const dy = this.y - y;
        return dx * dx + dy * dy;
    }

    /**
     * Return the distance between <code>(x1, y1)</code> and <code>(x2, y2)</code>.
     *
     * @param x1
     *          the x component of the first vector
     * @param y1
     *          the y component of the first vector
     * @param x2
     *          the x component of the second vector
     * @param y2
     *          the y component of the second vector
     * @return the euclidean distance
     */
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Return the squared distance between <code>(x1, y1)</code> and <code>(x2, y2)</code>.
     *
     * @param x1
     *          the x component of the first vector
     * @param y1
     *          the y component of the first vector
     * @param x2
     *          the x component of the second vector
     * @param y2
     *          the y component of the second vector
     * @return the euclidean distance squared
     */
    public static distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return dx * dx + dy * dy;
    }

    /**
     * Normalize this vector.
     * 
     * @return dest
     */
    public normalize(dest?: Vector2): Vector2;
    /**
     * Scale this vector to have the given length.
     * 
     * @param length
     *          the desired length
     * @return this
     */
    public normalize(length: number): Vector2;
    public normalize(length: number, dest: Vector2): Vector2;
    public normalize(length?: number | Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? ((length instanceof Vector2) ? length : this);
        if (length instanceof Vector2 || length === undefined) {
            length = 1;
        }
        const scalar = 1 / this.length() * length;
        dest.x = this.x * scalar;
        dest.y = this.y * scalar;
        return dest;
    }

    /**
     * Add <code>v</code> to this vector.
     * 
     * @param v
     *        the vector to add
     * @return this
     */
    public add(v: Vector2, dest?: Vector2): Vector2;

    /**
     * Increment the components of this vector by the given values.
     * 
     * @param x
     *          the x component to add
     * @param y
     *          the y component to add
     * @return this
     */
    public add(x: number, y: number, dest?: Vector2): Vector2;
    public add(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? (y instanceof Vector2 ? y : this);
        if (x instanceof Vector2) {
            y = x.y, x = x.x;
        } else {
            y = y as number;
        }
        dest.x = this.x + x;
        dest.y = this.y + y;
        return dest;
    }


    /**
     * Set all components to zero.
     * 
     * @return this
     */
    public zero(): Vector2 {
        this.x = 0;
        this.y = 0;
        return this;
    }

    /**
     * Negate this vector.
     * 
     * @return this
     */
    public negate(dest?: Vector2): Vector2 {
        return this.applyFunction(x => -x, dest);
    }

    /**
     * Multiply the components of this vector by the given scalar.
     * 
     * @param scalar
     *        the value to multiply this vector's components by
     * @return this
     */
    public mul(scalar: number, dest?: Vector2): Vector2;

    /**
     * Multiply the components of this Vector2 by the given scalar values and store the result in <code>this</code>.
     * 
     * @param x
     *          the x component to multiply this vector by
     * @param y
     *          the y component to multiply this vector by
     * @return this
     */
    public mul(x: number, y: number, dest?: Vector2): Vector2;

    /**
     * Multiply this Vector2 component-wise by another Vector2.
     * 
     * @param v
     *          the vector to multiply by
     * @return this
     */
    public mul(v: Vector2, dest?: Vector2): Vector2;

    /**
     * Multiply the given matrix with this Vector2 and store the result in <code>this</code>.
     *
     * @param mat
     *          the matrix
     * @return this
     */
    public mul(mat: Matrix2, dest: Vector2): Vector2;
    public mul(x: number | Vector2 | Matrix2, y?: number | Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? ((y instanceof Vector2) ? y : this);
        if (x instanceof Matrix2) {         // (mat: Matrix3, dest?: Vector3)
            const lx = this.x, ly = this.y;
            dest.x = x.m00 * lx + x.m10 * ly;
            dest.y = x.m01 * lx + x.m11 * ly;
            return dest;
        } else if (x instanceof Vector2) {  // (v: Vector2, dest?: Vector3)
            y = x.y, x = x.x;
        } else if (typeof y !== "number") { // (scalar: number, dest?: Vector3)
            y = x, x = x;
        }                                   // (x: number, y: number, dest?: Vector3)
        dest.x = this.x * x;
        dest.y = this.y * y;
        return dest;
    }

    /**
     * Divide this Vector2 component-wise by another Vector2c.
     * 
     * @param v
     *          the vector to divide by
     * @return this
     */
    public div(v: Vector2, dest?: Vector2): Vector2;

    /**
     * Divide all components of this {@link Vector2} by the given scalar
     * value.
     * 
     * @param scalar
     *          the scalar to divide by
     * @return this
     */
    public div(scalar: number, dest?: Vector2): Vector2;

    /**
     * Divide the components of this Vector2 by the given scalar values and store the result in <code>this</code>.
     * 
     * @param x
     *          the x component to divide this vector by
     * @param y
     *          the y component to divide this vector by
     * @return this
     */
    public div(x: number, y: number, dest?: Vector2): Vector2;
    public div(x: number | Vector2, y?: number | Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? ((y instanceof Vector2) ? y : this);
        if (x instanceof Vector2) {  // (v: Vector2, dest?: Vector3)
            y = x.y, x = x.x;
        } else if (typeof y !== "number") { // (scalar: number, dest?: Vector3)
            y = x, x = x;
        }                                   // (x: number, y: number, dest?: Vector3)
        dest.x = this.x / x;
        dest.y = this.y / y;
        return dest;
    }

    /**
     * Multiply the transpose of the given matrix with this Vector2 store the result in <code>this</code>.
     *
     * @param mat
     *          the matrix
     * @return this
     */
    public mulTranspose(mat: Matrix2, dest: Vector2): Vector2 {
        const rx = mat.m00 * this.x + mat.m01 * this.y;
        const ry = mat.m10 * this.x + mat.m11 * this.y;
        dest.x = rx;
        dest.y = ry;
        return dest;
    }

    /**
     * Multiply the given 3x2 matrix <code>mat</code> with <code>this</code>.
     * <p>
     * This method assumes the <code>z</code> component of <code>this</code> to be <code>1.0</code>.
     * 
     * @param mat
     *          the matrix to multiply this vector by
     * @return this
     */
    public mulPosition(mat: Matrix3, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = mat.m00 * this.x + mat.m10 * this.y + mat.m20;
        dest.y = mat.m01 * this.x + mat.m11 * this.y + mat.m21;
        return dest;
    }

    /**
     * Multiply the given 3x2 matrix <code>mat</code> with <code>this</code>.
     * <p>
     * This method assumes the <code>z</code> component of <code>this</code> to be <code>0.0</code>.
     * 
     * @param mat
     *          the matrix to multiply this vector by
     * @return this
     */
    public mulDirection(mat: Matrix3, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = mat.m00 * this.x + mat.m10 * this.y;
        dest.y = mat.m01 * this.x + mat.m11 * this.y;
        return dest;
    }

    /**
     * Linearly interpolate <code>this</code> and <code>other</code> using the given interpolation factor <code>t</code>
     * and store the result in <code>this</code>.
     * <p>
     * If <code>t</code> is <code>0.0</code> then the result is <code>this</code>. If the interpolation factor is <code>1.0</code>
     * then the result is <code>other</code>.
     * 
     * @param other
     *          the other vector
     * @param t
     *          the interpolation factor between 0.0 and 1.0
     * @return this
     */
    public lerp(other: Vector2, t: number, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = this.x + (other.x - this.x) * t;
        dest.y = this.y + (other.y - this.y) * t;
        return dest;
    }

    // public hashCode(): int {
    //     final int prime = 31;
    //     int result = 1;
    //     result = prime * result + Float.numberToIntBits(x);
    //     result = prime * result + Float.numberToIntBits(y);
    //     return result;
    // }

    public equals(v: Vector2, delta?: number): boolean;
    public equals(x: number, y: number): boolean;
    public equals(x: number | Vector2, y?: number, delta?: number): boolean {
        delta = delta ?? (x instanceof Vector2 ? y ?? 0 : 0);
        if (x instanceof Vector2) {
            y = x.y, x = x.x;
        }
        return (
            Math.abs(this.x - x) <= delta &&
            Math.abs(this.y - y) <= delta
        );
    }


    /**
     * Return a string representation of this vector by formatting the vector components with the given {@link NumberFormat}.
     * 
     * @param formatter
     *          the {@link NumberFormat} used to format the vector components with
     * @return the string representation
     */
    public toString(formatter?: (x: number, place: 'x' | 'y') => string) {
        formatter = formatter ?? ((x) => x.toFixed(20));
        return `${formatter(this.x, 'x')} ${formatter(this.y, 'y')}`;
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
    public fma(a: Vector2, b: Vector2, dest?: Vector2): Vector2;

    /**
     * Add the component-wise multiplication of <code>a * b</code> to this vector.
     * 
     * @param a
     *          the first multiplicand
     * @param b
     *          the second multiplicand
     * @return this
     */
    public fma(a: number, b: Vector2, dest?: Vector2): Vector2;
    public fma(a: number | Vector2, b: Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        if (!(a instanceof Vector2)) {
            a = { x: a, y: a } as Vector2;
        }
        dest.x = this.x + a.x * b.x;
        dest.y = this.y + a.y * b.y;
        return dest;
    }

    /**
     * Set the components of this vector to be the component-wise minimum of this and the other vector.
     *
     * @param v
     *          the other vector
     * @return this
     */
    public min(v: Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = this.x < v.x ? this.x : v.x;
        dest.y = this.y < v.y ? this.y : v.y;
        return dest;
    }

    /**
     * Set the components of this vector to be the component-wise maximum of this and the other vector.
     *
     * @param v
     *          the other vector
     * @return this
     */
    public max(v: Vector2, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = this.x > v.x ? this.x : v.x;
        dest.y = this.y > v.y ? this.y : v.y;
        return dest;
    }

    public maxComponent(): number {
        if (Math.abs(this.x) >= Math.abs(this.y))
            return 0;
        return 1;
    }

    public minComponent(): number {
        if (Math.abs(this.x) < Math.abs(this.y))
            return 0;
        return 1;
    }

    private applyFunction(func: (x: number) => number, dest?: Vector2): Vector2 {
        dest = dest ?? this;
        dest.x = func(this.x);
        dest.y = func(this.y);
        return dest;
    }

    /**
     * Set each component of this vector to the largest (to: closest positive
     * infinity) {@code number} value that is less than or equal to that
     * component and is equal to a mathematical integer.
     *
     * @return this
     */
    public floor(dest?: Vector2): Vector2 {
        return this.applyFunction(Math.floor, dest);
    }

    /**
     * Ceil each component of this vector
     *
     * @return this
     */
    public ceil(dest?: Vector2): Vector2 {
        return this.applyFunction(Math.ceil, dest);
    }

    /**
     * Set each component of this vector to the closest number that is equal to
     * a mathematical integer, ties: with rounding to positive infinity.
     *
     * @return this
     */
    public round(dest: Vector2): Vector2 {
        return this.applyFunction(Math.round, dest);
    }

    /**
     * Round each compoent of the vector to the nearest integer towards 0
     * 
     * @returns 
     */
    public trunc(dest?: Vector2): Vector2 {
        return this.applyFunction(Math.trunc, dest);
    }

    public isFinite(): boolean {
        return isFinite(this.x) && isFinite(this.y);
    }

    /**
     * Set <code>this</code> vector's components to their respective absolute values.
     * 
     * @return this
     */
    public absolute(dest: Vector2): Vector2 {
        return this.applyFunction(Math.abs, dest);
    }

    public clone(): Vector2 {
        return new Vector2(this);
    }
}
