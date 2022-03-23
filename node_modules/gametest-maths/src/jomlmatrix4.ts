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

class AxisAngle4 {
    angle: number
    x: number
    y: number
    z: number
}

import { Vector3 } from "./jomlvector3.js";
import { Matrix3 } from "./matrix3.js";
import { Vector4 } from "./jomlvector4.js";
import { Quaternion } from "./jomlquaternion";

/**
 * Contains the definition of a 4x4 Matrix of doubles, and associated functions to transform
 * it. The matrix is column-major to match OpenGL's interpretation, and it looks like this:
 * <p>
 *      m00  m10  m20  m30<br>
 *      m01  m11  m21  m31<br>
 *      m02  m12  m22  m32<br>
 *      m03  m13  m23  m33<br>
 * 
 * @author Richard Greenlees
 * @author Kai Burjack
 */
export class Matrix4 {

    [key: number]: { [key: number]: number };

    m00: number; m10: number; m20: number; m30: number;
    m01: number; m11: number; m21: number; m31: number;
    m02: number; m12: number; m22: number; m32: number;
    m03: number; m13: number; m23: number; m33: number;

    // double m00, m01, m02, m03;
    // double m10, m11, m12, m13;
    // double m20, m21, m22, m23;
    // double m30, m31, m32, m33;

    properties = {
        PROPERTY_IDENTITY: false,
        PROPERTY_AFFINE: false,
        PROPERTY_TRANSLATION: false,
        PROPERTY_ORTHONORMAL: false,
    };

    /**
     * Create a new {@link Matrix4} and set it to {@link #identity() identity}.
     */
    constructor();

    /**
     * Create a new {@link Matrix4} and make it a copy of the given matrix.
     * 
     * @param mat
     *          the {@link Matrix4} to copy the values from
     */
    constructor(mat: Matrix4);
    /**
     * Create a new 4x4 matrix using the supplied double values.
     * <p>
     * The matrix layout will be:<br><br>
     *   m00, m10, m20, m30<br>
     *   m01, m11, m21, m31<br>
     *   m02, m12, m22, m32<br>
     *   m03, m13, m23, m33
     * 
     * @param m00
     *          the value of m00
     * @param m01
     *          the value of m01
     * @param m02
     *          the value of m02
     * @param m03
     *          the value of m03
     * @param m10
     *          the value of m10
     * @param m11
     *          the value of m11
     * @param m12
     *          the value of m12
     * @param m13
     *          the value of m13
     * @param m20
     *          the value of m20
     * @param m21
     *          the value of m21
     * @param m22
     *          the value of m22
     * @param m23
     *          the value of m23
     * @param m30
     *          the value of m30
     * @param m31
     *          the value of m31
     * @param m32
     *          the value of m32
     * @param m33
     *          the value of m33
     */
    constructor(m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number);

    /**
     * Create a new {@link Matrix4d} and initialize its four columns using the supplied vectors.
     * 
     * @param col0 the first column
     * @param col1 the second column
     * @param col2 the third column
     * @param col3 the fourth column
     */
    constructor(col0: Vector4, col1: Vector4, col2: Vector4, col3: Vector4);
    constructor(m00?: number | Vector4 | Matrix4,
        m01?: number | Vector4, m02?: number | Vector4, m03?: number | Vector4,
        m10?: number, m11?: number, m12?: number, m13?: number,
        m20?: number, m21?: number, m22?: number, m23?: number,
        m30?: number, m31?: number, m32?: number, m33?: number) {
        if (m00 === undefined) { // ()
            this.m00 = 1, this.m10 = 0, this.m20 = 0, this.m30 = 0;
            this.m01 = 0, this.m11 = 1, this.m21 = 0, this.m31 = 0;
            this.m02 = 0, this.m12 = 0, this.m22 = 1, this.m32 = 0;
            this.m03 = 0, this.m13 = 0, this.m23 = 0, this.m33 = 1;
            return;
        }
        if (m00 instanceof Matrix4) { // (Matrix4)
            this.m00 = m00.m00, this.m10 = m00.m10, this.m20 = m00.m20, this.m30 = m00.m30;
            this.m01 = m00.m01, this.m11 = m00.m11, this.m21 = m00.m21, this.m31 = m00.m31;
            this.m02 = m00.m02, this.m12 = m00.m12, this.m22 = m00.m22, this.m32 = m00.m32;
            this.m03 = m00.m03, this.m13 = m00.m13, this.m23 = m00.m23, this.m33 = m00.m33;
            return;
        }
        if (m00 instanceof Vector4 && m01 instanceof Vector4
            && m02 instanceof Vector4 && m03 instanceof Vector4) { // (Vector4, Vector4, Vector4, Vector4)
            this.m33 = m03.w, this.m32 = m03.z, this.m31 = m03.y, this.m30 = m03.x;
            this.m23 = m02.w, this.m22 = m02.z, this.m21 = m02.y, this.m20 = m02.x;
            this.m13 = m01.w, this.m12 = m01.z, this.m11 = m01.y, this.m10 = m01.x;
            this.m03 = m00.w, this.m02 = m00.z, this.m01 = m00.y, this.m00 = m00.x;
            return;
        } // (m00 ... m33)
        this.m00 = m00 as number, this.m10 = m10, this.m20 = m20, this.m30 = m30;
        this.m01 = m01 as number, this.m11 = m11, this.m21 = m21, this.m31 = m31;
        this.m02 = m02 as number, this.m12 = m12, this.m22 = m22, this.m32 = m32;
        this.m03 = m03 as number, this.m13 = m13, this.m23 = m23, this.m33 = m33;
    }

    /**
     * Assume the given properties about this matrix.
     * <p>
     * Use one or multiple of 0, {@link Matrix4dc#PROPERTY_IDENTITY},
     * {@link Matrix4dc#PROPERTY_TRANSLATION}, {@link Matrix4dc#PROPERTY_AFFINE},
     * {@link Matrix4dc#PROPERTY_PERSPECTIVE}, {@link Matrix4fc#PROPERTY_ORTHONORMAL}.
     * 
     * @param properties
     *          bitset of the properties to assume about this matrix
     * @return this
     */
    // public assume(properties: number): Matrix4 {
    //     this.properties = (byte) properties;
    //     return this;
    // }

    get PROPERTY_AFFINE(): boolean {
        return this.m03 === 0 && this.m13 === 0 && this.m23 === 0 && this.m33 === 1;
    }

    get PROPERTY_TRANSLATION(): boolean {
        return this.PROPERTY_AFFINE
            && this.m00 === 1 && this.m10 === 0 && this.m20 === 0
            && this.m01 === 0 && this.m11 === 1 && this.m21 === 0
            && this.m02 === 0 && this.m12 === 0 && this.m22 === 1;
    }

    // TODO: is this the same as translation???
    get PROPERTY_ORTHONORMAL(): boolean {
        return this.PROPERTY_TRANSLATION;
    }

    get PROPERTY_IDENTITY(): boolean {
        return this.PROPERTY_TRANSLATION
            && this.m30 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1;
    }

    get PROPERTY_PERSPECTIVE(): boolean {
        return this.m01 == 0 && this.m02 == 0 && this.m03 == 0
            && this.m10 == 0 && this.m12 == 0 && this.m13 == 0
            && this.m20 == 0 && this.m21 == 0
            && this.m30 == 0 && this.m31 == 0 && this.m33 == 0
    }

    get 0() {
        const m = this;
        return {
            get 0(): number { return m.m00 },
            get 1(): number { return m.m01 },
            get 2(): number { return m.m02 },
            get 3(): number { return m.m03 },
            set 0(v: number) { m.m00 = v },
            set 1(v: number) { m.m01 = v },
            set 2(v: number) { m.m02 = v },
            set 3(v: number) { m.m03 = v },
        }
    }
    get 1() {
        const m = this;
        return {
            get 0(): number { return m.m10 },
            get 1(): number { return m.m11 },
            get 2(): number { return m.m12 },
            get 3(): number { return m.m13 },
            set 0(v: number) { m.m10 = v },
            set 1(v: number) { m.m11 = v },
            set 2(v: number) { m.m12 = v },
            set 3(v: number) { m.m13 = v },
        }
    }
    get 2() {
        const m = this;
        return {
            get 0(): number { return m.m20 },
            get 1(): number { return m.m21 },
            get 2(): number { return m.m22 },
            get 3(): number { return m.m23 },
            set 0(v: number) { m.m20 = v },
            set 1(v: number) { m.m21 = v },
            set 2(v: number) { m.m22 = v },
            set 3(v: number) { m.m23 = v },
        }
    }
    get 3() {
        const m = this;
        return {
            get 0(): number { return m.m30 },
            get 1(): number { return m.m31 },
            get 2(): number { return m.m32 },
            get 3(): number { return m.m33 },
            set 0(v: number) { m.m30 = v },
            set 1(v: number) { m.m31 = v },
            set 2(v: number) { m.m32 = v },
            set 3(v: number) { m.m33 = v },
        }
    }

    /**
     * Reset this matrix to the identity.
     * <p>
     * Please note that if a call to {@link #identity()} is immediately followed by a call to:
     * {@link #translate(double, double, double) translate}, 
     * {@link #rotate(double, double, double, double) rotate},
     * {@link #scale(double, double, double) scale},
     * {@link #perspective(double, double, double, double) perspective},
     * {@link #frustum(double, double, double, double, double, double) frustum},
     * {@link #ortho(double, double, double, double, double, double) ortho},
     * {@link #ortho2D(double, double, double, double) ortho2D},
     * {@link #lookAt(double, double, double, double, double, double, double, double, double) lookAt},
     * {@link #lookAlong(double, double, double, double, double, double) lookAlong},
     * or any of their overloads, then the call to {@link #identity()} can be omitted and the subsequent call replaced with:
     * {@link #translation(double, double, double) translation},
     * {@link #rotation(double, double, double, double) rotation},
     * {@link #scaling(double, double, double) scaling},
     * {@link #setPerspective(double, double, double, double) setPerspective},
     * {@link #setFrustum(double, double, double, double, double, double) setFrustum},
     * {@link #setOrtho(double, double, double, double, double, double) setOrtho},
     * {@link #setOrtho2D(double, double, double, double) setOrtho2D},
     * {@link #setLookAt(double, double, double, double, double, double, double, double, double) setLookAt},
     * {@link #setLookAlong(double, double, double, double, double, double) setLookAlong},
     * or any of their overloads.
     * 
     * @return this
     */
    public identity(): Matrix4 {
        this.m00 = 1; this.m10 = 0; this.m20 = 0; this.m30 = 0;
        this.m01 = 0; this.m11 = 1; this.m21 = 0; this.m31 = 0;
        this.m02 = 0; this.m12 = 0; this.m22 = 1; this.m32 = 0;
        this.m03 = 0; this.m13 = 0; this.m23 = 0; this.m33 = 1;
        return this;
    }

    /**
     * Store the values of the transpose of the given matrix <code>m</code> into <code>this</code> matrix.
     * 
     * @param m
     *          the matrix to copy the transposed values from
     * @return this
     */
    public setTransposed(m: Matrix4): Matrix4 {
        return this.set(
            m.m00, m.m10, m.m20, m.m30,
            m.m01, m.m11, m.m21, m.m31,
            m.m02, m.m12, m.m22, m.m32,
            m.m03, m.m13, m.m23, m.m33,
        )
    }

    /**
     * Set the upper left 3x3 submatrix of this {@link Matrix4d} to that of the given {@link Matrix4dc} 
     * and don't change the other elements.
     * 
     * @param mat
     *          the {@link Matrix4dc}
     * @return this
     */
    public set3x3(mat: Matrix3) {
        this.m00 = mat.m00; this.m10 = mat.m10; this.m20 = mat.m20;
        this.m01 = mat.m01; this.m11 = mat.m11; this.m21 = mat.m21;
        this.m02 = mat.m02; this.m12 = mat.m12; this.m22 = mat.m22;
        return this;
    }

    /**
     * Set the upper 4x3 submatrix of this {@link Matrix4d} to the given {@link Matrix4x3dc} 
     * and don't change the other elements.
     * 
     * @see Matrix4x3dc#get(Matrix4d)
     * 
     * @param mat
     *          the {@link Matrix4x3dc}
     * @return this
     */
    public set4x3(mat: Matrix4): Matrix4 {
        this.m00 = mat.m00; this.m10 = mat.m10; this.m20 = mat.m20; this.m30 = mat.m30;
        this.m01 = mat.m01; this.m11 = mat.m11; this.m21 = mat.m21; this.m31 = mat.m31;
        this.m02 = mat.m02; this.m12 = mat.m12; this.m22 = mat.m22; this.m32 = mat.m32;
        return this;
    }


    /**
     * Multiply this matrix by the supplied <code>right</code> matrix.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * transformation of the right matrix will be applied first!
     * 
     * @param right
     *          the right operand of the multiplication
     * @return this
     */
    public mul(right: Matrix4, dest: Matrix4): Matrix4;

    /**
     * Multiply this matrix by the matrix with the supplied elements.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix whose 
     * elements are supplied via the parameters, the: then new matrix will be <code>M * R</code>.
     * So when transforming a vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * transformation of the right matrix will be applied first!
     *
     * @param r00
     *          the m00 element of the right matrix
     * @param r01
     *          the m01 element of the right matrix
     * @param r02
     *          the m02 element of the right matrix
     * @param r03
     *          the m03 element of the right matrix
     * @param r10
     *          the m10 element of the right matrix
     * @param r11
     *          the m11 element of the right matrix
     * @param r12
     *          the m12 element of the right matrix
     * @param r13
     *          the m13 element of the right matrix
     * @param r20
     *          the m20 element of the right matrix
     * @param r21
     *          the m21 element of the right matrix
     * @param r22
     *          the m22 element of the right matrix
     * @param r23
     *          the m23 element of the right matrix
     * @param r30
     *          the m30 element of the right matrix
     * @param r31
     *          the m31 element of the right matrix
     * @param r32
     *          the m32 element of the right matrix
     * @param r33
     *          the m33 element of the right matrix
     * @return this
     */
    public mul(
        r00: number, r01: number, r02: number, r03: number,
        r10: number, r11: number, r12: number, r13: number,
        r20: number, r21: number, r22: number, r23: number,
        r30: number, r31: number, r32: number, r33: number, dest?: Matrix4): Matrix4
    public mul(
        r00: number | Matrix4, r01?: number | Matrix4, r02?: number, r03?: number,
        r10?: number, r11?: number, r12?: number, r13?: number,
        r20?: number, r21?: number, r22?: number, r23?: number,
        r30?: number, r31?: number, r32?: number, r33?: number, dest?: Matrix4): Matrix4 {

        if (r00 instanceof Matrix4) {
            const right = r00; dest = r01 as Matrix4;
            if (this.PROPERTY_IDENTITY)
                return dest.set(right);
            else if (right.PROPERTY_IDENTITY)
                return dest.set(this);
            else if (this.PROPERTY_TRANSLATION && right.PROPERTY_AFFINE)
                return this.mulTranslationAffine(right, dest);
            else if (this.PROPERTY_AFFINE && right.PROPERTY_AFFINE)
                return this.mulAffine(right, dest);
            else if (this.PROPERTY_PERSPECTIVE && right.PROPERTY_AFFINE)
                return this.mulPerspectiveAffine(right, dest);
            else if (right.PROPERTY_AFFINE)
                return this.mulAffineR(right, dest);
            return this.mul0(right, dest);
        } else {
            r01 = r01 as number;
            if (this.PROPERTY_IDENTITY)
                return dest.set(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33);
            else if (this.PROPERTY_AFFINE)
                return this.mulAffineL(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest);
            return this.mulGeneric(r00, r01, r02, r03, r10, r11, r12, r13, r20, r21, r22, r23, r30, r31, r32, r33, dest);
        }
    }

    /**
     * Multiply this matrix by the supplied <code>right</code> matrix.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * transformation of the right matrix will be applied first!
     * <p>
     * This method neither assumes nor checks for any matrix properties of <code>this</code> or <code>right</code>
     * and will always perform a complete 4x4 matrix multiplication. This method should only be used whenever the
     * multiplied matrices do not have any properties for which there are optimized multiplication methods available.
     * 
     * @param right
     *          the right operand of the matrix multiplication
     * @return this
     */
    public mul0(right: Matrix4, dest?: Matrix4) {
        dest = dest ?? this;
        return dest.set(
            this.m00 * right.m00 + this.m10 * right.m01 + this.m20 * right.m02 + this.m30 * right.m03,
            this.m01 * right.m00 + this.m11 * right.m01 + this.m21 * right.m02 + this.m31 * right.m03,
            this.m02 * right.m00 + this.m12 * right.m01 + this.m22 * right.m02 + this.m32 * right.m03,
            this.m03 * right.m00 + this.m13 * right.m01 + this.m23 * right.m02 + this.m33 * right.m03,
            this.m00 * right.m10 + this.m10 * right.m11 + this.m20 * right.m12 + this.m30 * right.m13,
            this.m01 * right.m10 + this.m11 * right.m11 + this.m21 * right.m12 + this.m31 * right.m13,
            this.m02 * right.m10 + this.m12 * right.m11 + this.m22 * right.m12 + this.m32 * right.m13,
            this.m03 * right.m10 + this.m13 * right.m11 + this.m23 * right.m12 + this.m33 * right.m13,
            this.m00 * right.m20 + this.m10 * right.m21 + this.m20 * right.m22 + this.m30 * right.m23,
            this.m01 * right.m20 + this.m11 * right.m21 + this.m21 * right.m22 + this.m31 * right.m23,
            this.m02 * right.m20 + this.m12 * right.m21 + this.m22 * right.m22 + this.m32 * right.m23,
            this.m03 * right.m20 + this.m13 * right.m21 + this.m23 * right.m22 + this.m33 * right.m23,
            this.m00 * right.m30 + this.m10 * right.m31 + this.m20 * right.m32 + this.m30 * right.m33,
            this.m01 * right.m30 + this.m11 * right.m31 + this.m21 * right.m32 + this.m31 * right.m33,
            this.m02 * right.m30 + this.m12 * right.m31 + this.m22 * right.m32 + this.m32 * right.m33,
            this.m03 * right.m30 + this.m13 * right.m31 + this.m23 * right.m32 + this.m33 * right.m33,
        );
    }

    private mulAffineL(
        r00: number, r01: number, r02: number, r03: number,
        r10: number, r11: number, r12: number, r13: number,
        r20: number, r21: number, r22: number, r23: number,
        r30: number, r31: number, r32: number, r33: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00 * r00 + this.m10 * r01 + this.m20 * r02 + this.m30 * r03,
            this.m01 * r00 + this.m11 * r01 + this.m21 * r02 + this.m31 * r03,
            this.m02 * r00 + this.m12 * r01 + this.m22 * r02 + this.m32 * r03,
            r03,
            this.m00 * r10 + this.m10 * r11 + this.m20 * r12 + this.m30 * r13,
            this.m01 * r10 + this.m11 * r11 + this.m21 * r12 + this.m31 * r13,
            this.m02 * r10 + this.m12 * r11 + this.m22 * r12 + this.m32 * r13,
            r13,
            this.m00 * r20 + this.m10 * r21 + this.m20 * r22 + this.m30 * r23,
            this.m01 * r20 + this.m11 * r21 + this.m21 * r22 + this.m31 * r23,
            this.m02 * r20 + this.m12 * r21 + this.m22 * r22 + this.m32 * r23,
            r23,
            this.m00 * r30 + this.m10 * r31 + this.m20 * r32 + this.m30 * r33,
            this.m01 * r30 + this.m11 * r31 + this.m21 * r32 + this.m31 * r33,
            this.m02 * r30 + this.m12 * r31 + this.m22 * r32 + this.m32 * r33,
            r33,
        )
    }
    private mulGeneric(
        r00: number, r01: number, r02: number, r03: number,
        r10: number, r11: number, r12: number, r13: number,
        r20: number, r21: number, r22: number, r23: number,
        r30: number, r31: number, r32: number, r33: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00 * r00 + this.m10 * r01 + this.m20 * r02 + this.m30 * r03,
            this.m01 * r00 + this.m11 * r01 + this.m21 * r02 + this.m31 * r03,
            this.m02 * r00 + this.m12 * r01 + this.m22 * r02 + this.m32 * r03,
            this.m03 * r00 + this.m13 * r01 + this.m23 * r02 + this.m33 * r03,
            this.m00 * r10 + this.m10 * r11 + this.m20 * r12 + this.m30 * r13,
            this.m01 * r10 + this.m11 * r11 + this.m21 * r12 + this.m31 * r13,
            this.m02 * r10 + this.m12 * r11 + this.m22 * r12 + this.m32 * r13,
            this.m03 * r10 + this.m13 * r11 + this.m23 * r12 + this.m33 * r13,
            this.m00 * r20 + this.m10 * r21 + this.m20 * r22 + this.m30 * r23,
            this.m01 * r20 + this.m11 * r21 + this.m21 * r22 + this.m31 * r23,
            this.m02 * r20 + this.m12 * r21 + this.m22 * r22 + this.m32 * r23,
            this.m03 * r20 + this.m13 * r21 + this.m23 * r22 + this.m33 * r23,
            this.m00 * r30 + this.m10 * r31 + this.m20 * r32 + this.m30 * r33,
            this.m01 * r30 + this.m11 * r31 + this.m21 * r32 + this.m31 * r33,
            this.m02 * r30 + this.m12 * r31 + this.m22 * r32 + this.m32 * r33,
            this.m03 * r30 + this.m13 * r31 + this.m23 * r32 + this.m33 * r33,
        );
    }

    /**
     * Multiply this matrix by the 3x3 matrix with the supplied elements expanded to a 4x4 matrix with 
     * all other matrix elements set to identity.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix whose 
     * elements are supplied via the parameters, the: then new matrix will be <code>M * R</code>.
     * So when transforming a vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * transformation of the right matrix will be applied first!
     *
     * @param r00
     *          the m00 element of the right matrix
     * @param r01
     *          the m01 element of the right matrix
     * @param r02
     *          the m02 element of the right matrix
     * @param r10
     *          the m10 element of the right matrix
     * @param r11
     *          the m11 element of the right matrix
     * @param r12
     *          the m12 element of the right matrix
     * @param r20
     *          the m20 element of the right matrix
     * @param r21
     *          the m21 element of the right matrix
     * @param r22
     *          the m22 element of the right matrix
     * @return this
     */
    public mul3x3(
        r00: number, r01: number, r02: number,
        r10: number, r11: number, r12: number,
        r20: number, r21: number, r22: number, dest?: Matrix4): Matrix4 {
        if (this.PROPERTY_IDENTITY)
            return dest.set(r00, r01, r02, 0, r10, r11, r12, 0, r20, r21, r22, 0, 0, 0, 0, 1);
        return this.mulGeneric3x3(r00, r01, r02, r10, r11, r12, r20, r21, r22, dest);
    }
    private mulGeneric3x3(
        r00: number, r01: number, r02: number,
        r10: number, r11: number, r12: number,
        r20: number, r21: number, r22: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00 * r00 + this.m10 * r01 + this.m20 * r02,
            this.m01 * r00 + this.m11 * r01 + this.m21 * r02,
            this.m02 * r00 + this.m12 * r01 + this.m22 * r02,
            this.m03 * r00 + this.m13 * r01 + this.m23 * r02,
            this.m00 * r10 + this.m10 * r11 + this.m20 * r12,
            this.m01 * r10 + this.m11 * r11 + this.m21 * r12,
            this.m02 * r10 + this.m12 * r11 + this.m22 * r12,
            this.m03 * r10 + this.m13 * r11 + this.m23 * r12,
            this.m00 * r20 + this.m10 * r21 + this.m20 * r22,
            this.m01 * r20 + this.m11 * r21 + this.m21 * r22,
            this.m02 * r20 + this.m12 * r21 + this.m22 * r22,
            this.m03 * r20 + this.m13 * r21 + this.m23 * r22,

            this.m30, this.m31, this.m32, this.m33,
        )
    }

    /**
     * Pre-multiply this matrix by the supplied <code>left</code> matrix and store the result in <code>this</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the <code>left</code> matrix,
     * then the new matrix will be <code>L * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>L * M * v</code>, the
     * transformation of <code>this</code> matrix will be applied first!
     *
     * @param left
     *          the left operand of the matrix multiplication
     * @return this
     */
    public mulLocal(left: Matrix4, dest?: Matrix4): Matrix4 {
        return left.mul(this, dest)
    }

    /**
     * Pre-multiply this matrix by the supplied <code>left</code> matrix, of: both which are assumed to be {@link #isAffine() affine}, store: and the result in <code>this</code>.
     * <p>
     * This method assumes that <code>this</code> matrix and the given <code>left</code> matrix both represent an {@link #isAffine() affine} transformation
     * (i.e. their last rows are equal to <code>(0, 0, 0, 1)</code>)
     * and can be used to speed up matrix multiplication if the matrices only represent affine transformations, as: such translation, rotation, and: scaling shearing (any: in combination).
     * <p>
     * This method will not modify either the last row of <code>this</code> or the last row of <code>left</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the <code>left</code> matrix,
     * then the new matrix will be <code>L * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>L * M * v</code>, the
     * transformation of <code>this</code> matrix will be applied first!
     *
     * @param left
     *          the left operand of the matrix multiplication (last: the row is assumed to be <code>(0, 0, 0, 1)</code>)
     * @return this
     */
    public mulLocalAffine(left: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            left.m00 * this.m00 + left.m10 * this.m01 + left.m20 * this.m02,
            left.m01 * this.m00 + left.m11 * this.m01 + left.m21 * this.m02,
            left.m02 * this.m00 + left.m12 * this.m01 + left.m22 * this.m02,
            left.m03,
            left.m00 * this.m10 + left.m10 * this.m11 + left.m20 * this.m12,
            left.m01 * this.m10 + left.m11 * this.m11 + left.m21 * this.m12,
            left.m02 * this.m10 + left.m12 * this.m11 + left.m22 * this.m12,
            left.m13,
            left.m00 * this.m20 + left.m10 * this.m21 + left.m20 * this.m22,
            left.m01 * this.m20 + left.m11 * this.m21 + left.m21 * this.m22,
            left.m02 * this.m20 + left.m12 * this.m21 + left.m22 * this.m22,
            left.m23,
            left.m00 * this.m30 + left.m10 * this.m31 + left.m20 * this.m32 + left.m30,
            left.m01 * this.m30 + left.m11 * this.m31 + left.m21 * this.m32 + left.m31,
            left.m02 * this.m30 + left.m12 * this.m31 + left.m22 * this.m32 + left.m32,
            left.m33,
        )
        // ._properties(PROPERTY_AFFINE);
        // return dest;
    }


    /**
     * Multiply <code>this</code> symmetric perspective projection matrix by the supplied {@link #isAffine() affine} <code>view</code> matrix.
     * <p>
     * If <code>P</code> is <code>this</code> matrix and <code>V</code> the <code>view</code> matrix,
     * then the new matrix will be <code>P * V</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>P * V * v</code>, the
     * transformation of the <code>view</code> matrix will be applied first!
     *
     * @param view
     *          the {@link #isAffine() affine} matrix to multiply <code>this</code> symmetric perspective projection matrix by
     * @return this
     */
    public mulPerspectiveAffine(view: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00 * view.m00, this.m11 * view.m01, this.m22 * view.m02, this.m23 * view.m02,
            this.m00 * view.m10, this.m11 * view.m11, this.m22 * view.m12, this.m23 * view.m12,
            this.m00 * view.m20, this.m11 * view.m21, this.m22 * view.m22, this.m23 * view.m22,
            this.m00 * view.m30, this.m11 * view.m31, this.m22 * view.m32 + this.m32, this.m23 * view.m32,
        );
        // ._properties(0);
    }

    /**
     * Multiply this matrix by the supplied <code>right</code> matrix, is: which assumed to be {@link #isAffine() affine}, store: and the result in <code>this</code>.
     * <p>
     * This method assumes that the given <code>right</code> matrix represents an {@link #isAffine() affine} transformation (i.e. its last row is equal to <code>(0, 0, 0, 1)</code>)
     * and can be used to speed up matrix multiplication if the matrix only represents affine transformations, as: such translation, rotation, and: scaling shearing (any: in combination).
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * transformation of the right matrix will be applied first!
     *
     * @param right
     *          the right operand of the matrix multiplication (last: the row is assumed to be <code>(0, 0, 0, 1)</code>)
     * @return this
     */
    public mulAffineR(right: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00 * right.m00 + this.m10 * right.m01 + this.m20 * right.m02,
            this.m01 * right.m00 + this.m11 * right.m01 + this.m21 * right.m02,
            this.m02 * right.m00 + this.m12 * right.m01 + this.m22 * right.m02,
            this.m03 * right.m00 + this.m13 * right.m01 + this.m23 * right.m02,
            this.m00 * right.m10 + this.m10 * right.m11 + this.m20 * right.m12,
            this.m01 * right.m10 + this.m11 * right.m11 + this.m21 * right.m12,
            this.m02 * right.m10 + this.m12 * right.m11 + this.m22 * right.m12,
            this.m03 * right.m10 + this.m13 * right.m11 + this.m23 * right.m12,
            this.m00 * right.m20 + this.m10 * right.m21 + this.m20 * right.m22,
            this.m01 * right.m20 + this.m11 * right.m21 + this.m21 * right.m22,
            this.m02 * right.m20 + this.m12 * right.m21 + this.m22 * right.m22,
            this.m03 * right.m20 + this.m13 * right.m21 + this.m23 * right.m22,
            this.m00 * right.m30 + this.m10 * right.m31 + this.m20 * right.m32 + this.m30,
            this.m01 * right.m30 + this.m11 * right.m31 + this.m21 * right.m32 + this.m31,
            this.m02 * right.m30 + this.m12 * right.m31 + this.m22 * right.m32 + this.m32,
            this.m03 * right.m30 + this.m13 * right.m31 + this.m23 * right.m32 + this.m33,
        )
        // ._properties(: properties & ~(: PROPERTY_IDENTITY | PROPERTY_PERSPECTIVE | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        // return dest;
    }

    /**
     * Multiply this matrix by the supplied <code>right</code> matrix, of: both which are assumed to be {@link #isAffine() affine}, store: and the result in <code>this</code>.
     * <p>
     * This method assumes that <code>this</code> matrix and the given <code>right</code> matrix both represent an {@link #isAffine() affine} transformation
     * (i.e. their last rows are equal to <code>(0, 0, 0, 1)</code>)
     * and can be used to speed up matrix multiplication if the matrices only represent affine transformations, as: such translation, rotation, and: scaling shearing (any: in combination).
     * <p>
     * This method will not modify either the last row of <code>this</code> or the last row of <code>right</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the <code>right</code> matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * transformation of the right matrix will be applied first!
     *
     * @param right
     *          the right operand of the matrix multiplication (last: the row is assumed to be <code>(0, 0, 0, 1)</code>)
     * @return this
     */
    public mulAffine(right: Matrix4, dest?: Matrix4): Matrix4 {
        return dest.set(
            this.m00 * right.m00 + this.m10 * right.m01 + this.m20 * right.m02,
            this.m01 * right.m00 + this.m11 * right.m01 + this.m21 * right.m02,
            this.m02 * right.m00 + this.m12 * right.m01 + this.m22 * right.m02,
            this.m03,
            this.m00 * right.m10 + this.m10 * right.m11 + this.m20 * right.m12,
            this.m01 * right.m10 + this.m11 * right.m11 + this.m21 * right.m12,
            this.m02 * right.m10 + this.m12 * right.m11 + this.m22 * right.m12,
            this.m13,
            this.m00 * right.m20 + this.m10 * right.m21 + this.m20 * right.m22,
            this.m01 * right.m20 + this.m11 * right.m21 + this.m21 * right.m22,
            this.m02 * right.m20 + this.m12 * right.m21 + this.m22 * right.m22,
            this.m23,
            this.m00 * right.m30 + this.m10 * right.m31 + this.m20 * right.m32 + this.m30,
            this.m01 * right.m30 + this.m11 * right.m31 + this.m21 * right.m32 + this.m31,
            this.m02 * right.m30 + this.m12 * right.m31 + this.m22 * right.m32 + this.m32,
            this.m33,
        )
        // ._properties(: PROPERTY_AFFINE | (this.properties & right.properties() & PROPERTY_ORTHONORMAL));
    }

    public mulTranslationAffine(right: Matrix4, dest: Matrix4): Matrix4 {
        return dest.set(
            right.m00,
            right.m01,
            right.m02,
            this.m03,
            right.m10,
            right.m11,
            right.m12,
            this.m13,
            right.m20,
            right.m21,
            right.m22,
            this.m23,
            right.m30 + this.m30,
            right.m31 + this.m31,
            right.m32 + this.m32,
            this.m33,
        );
        // ._properties(: PROPERTY_AFFINE | (right.properties() & PROPERTY_ORTHONORMAL));
    }

    /**
     * Multiply <code>this</code> orthographic projection matrix by the supplied {@link #isAffine() affine} <code>view</code> matrix.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>V</code> the <code>view</code> matrix,
     * then the new matrix will be <code>M * V</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * V * v</code>, the
     * transformation of the <code>view</code> matrix will be applied first!
     *
     * @param view
     *          the affine matrix which to multiply <code>this</code> with
     * @return this
     */
    public mulOrthoAffine(view: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00 * view.m00,
            this.m11 * view.m01,
            this.m22 * view.m02,
            0.0,
            this.m00 * view.m10,
            this.m11 * view.m11,
            this.m22 * view.m12,
            0.0,
            this.m00 * view.m20,
            this.m11 * view.m21,
            this.m22 * view.m22,
            0.0,
            this.m00 * view.m30 + this.m30,
            this.m11 * view.m31 + this.m31,
            this.m22 * view.m32 + this.m32,
            1.0,
        )
        // ._properties(PROPERTY_AFFINE);
        // return dest;
    }

    /**
     * Component-wise add the upper 4x3 submatrices of <code>this</code> and <code>other</code>
     * by first multiplying each component of <code>other</code>'s 4x3 submatrix by <code>otherFactor</code> and
     * adding that result to <code>this</code>.
     * <p>
     * The matrix <code>other</code> will not be changed.
     * 
     * @param other
     *          the other matrix
     * @param otherFactor
     *          the factor to multiply each of the other matrix's 4x3 components
     * @return this
     */
    public fma4x3(other: Matrix4, otherFactor: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = other.m00 * otherFactor + this.m00;
        dest.m01 = other.m01 * otherFactor + this.m01;
        dest.m02 = other.m02 * otherFactor + this.m02;
        dest.m03 = this.m03;
        dest.m10 = other.m10 * otherFactor + this.m10;
        dest.m11 = other.m11 * otherFactor + this.m11;
        dest.m12 = other.m12 * otherFactor + this.m12;
        dest.m13 = this.m13;
        dest.m20 = other.m20 * otherFactor + this.m20;
        dest.m21 = other.m21 * otherFactor + this.m21;
        dest.m22 = other.m22 * otherFactor + this.m22;
        dest.m23 = this.m23;
        dest.m30 = other.m30 * otherFactor + this.m30;
        dest.m31 = other.m31 * otherFactor + this.m31;
        dest.m32 = other.m32 * otherFactor + this.m32;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Component-wise add <code>this</code> and <code>other</code>.
     * 
     * @param other
     *          the other addend
     * @return this
     */
    public add(other: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = this.m00 + other.m00
        dest.m01 = this.m01 + other.m01
        dest.m02 = this.m02 + other.m02
        dest.m03 = this.m03 + other.m03
        dest.m10 = this.m10 + other.m10
        dest.m11 = this.m11 + other.m11
        dest.m12 = this.m12 + other.m12
        dest.m13 = this.m13 + other.m13
        dest.m20 = this.m20 + other.m20
        dest.m21 = this.m21 + other.m21
        dest.m22 = this.m22 + other.m22
        dest.m23 = this.m23 + other.m23
        dest.m30 = this.m30 + other.m30
        dest.m31 = this.m31 + other.m31
        dest.m32 = this.m32 + other.m32
        dest.m33 = this.m33 + other.m33
        return dest;
    }

    /**
     * Component-wise subtract <code>subtrahend</code> from <code>this</code>.
     * 
     * @param subtrahend
     *          the subtrahend
     * @return this
     */
    public sub(subtrahend: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = this.m00 - subtrahend.m00
        dest.m01 = this.m01 - subtrahend.m01
        dest.m02 = this.m02 - subtrahend.m02
        dest.m03 = this.m03 - subtrahend.m03
        dest.m10 = this.m10 - subtrahend.m10
        dest.m11 = this.m11 - subtrahend.m11
        dest.m12 = this.m12 - subtrahend.m12
        dest.m13 = this.m13 - subtrahend.m13
        dest.m20 = this.m20 - subtrahend.m20
        dest.m21 = this.m21 - subtrahend.m21
        dest.m22 = this.m22 - subtrahend.m22
        dest.m23 = this.m23 - subtrahend.m23
        dest.m30 = this.m30 - subtrahend.m30
        dest.m31 = this.m31 - subtrahend.m31
        dest.m32 = this.m32 - subtrahend.m32
        dest.m33 = this.m33 - subtrahend.m33
        return dest;
    }

    /**
     * Component-wise multiply <code>this</code> by <code>other</code>.
     * 
     * @param other
     *          the other matrix
     * @return this
     */
    public mulComponentWise(other: Matrix4, dest?: Matrix4) {
        dest = dest ?? this;
        dest.m00 = this.m00 * other.m00;
        dest.m01 = this.m01 * other.m01;
        dest.m02 = this.m02 * other.m02;
        dest.m03 = this.m03 * other.m03;
        dest.m10 = this.m10 * other.m10;
        dest.m11 = this.m11 * other.m11;
        dest.m12 = this.m12 * other.m12;
        dest.m13 = this.m13 * other.m13;
        dest.m20 = this.m20 * other.m20;
        dest.m21 = this.m21 * other.m21;
        dest.m22 = this.m22 * other.m22;
        dest.m23 = this.m23 * other.m23;
        dest.m30 = this.m30 * other.m30;
        dest.m31 = this.m31 * other.m31;
        dest.m32 = this.m32 * other.m32;
        dest.m33 = this.m33 * other.m33;
        return dest;
    }

    /**
     * Component-wise add the upper 4x3 submatrices of <code>this</code> and <code>other</code>.
     * 
     * @param other
     *          the other addend
     * @return this
     */
    public add4x3(other: Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = this.m00 + other.m00;
        dest.m01 = this.m01 + other.m01;
        dest.m02 = this.m02 + other.m02;
        dest.m03 = this.m03;
        dest.m10 = this.m10 + other.m10;
        dest.m11 = this.m11 + other.m11;
        dest.m12 = this.m12 + other.m12;
        dest.m13 = this.m13;
        dest.m20 = this.m20 + other.m20;
        dest.m21 = this.m21 + other.m21;
        dest.m22 = this.m22 + other.m22;
        dest.m23 = this.m23;
        dest.m30 = this.m30 + other.m30;
        dest.m31 = this.m31 + other.m31;
        dest.m32 = this.m32 + other.m32;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Component-wise subtract the upper 4x3 submatrices of <code>subtrahend</code> from <code>this</code>.
     * 
     * @param subtrahend
     *          the subtrahend
     * @return this
     */
    public sub4x3(subtrahend: Matrix4, dest: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = this.m00 - subtrahend.m00;
        dest.m01 = this.m01 - subtrahend.m01;
        dest.m02 = this.m02 - subtrahend.m02;
        dest.m03 = this.m03;
        dest.m10 = this.m10 - subtrahend.m10;
        dest.m11 = this.m11 - subtrahend.m11;
        dest.m12 = this.m12 - subtrahend.m12;
        dest.m13 = this.m13;
        dest.m20 = this.m20 - subtrahend.m20;
        dest.m21 = this.m21 - subtrahend.m21;
        dest.m22 = this.m22 - subtrahend.m22;
        dest.m23 = this.m23;
        dest.m30 = this.m30 - subtrahend.m30;
        dest.m31 = this.m31 - subtrahend.m31;
        dest.m32 = this.m32 - subtrahend.m32;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Component-wise multiply the upper 4x3 submatrices of <code>this</code> by <code>other</code>.
     * 
     * @param other
     *          the other matrix
     * @return this
     */
    public mul4x3ComponentWise(other: Matrix4, dest: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = this.m00 * other.m00;
        dest.m01 = this.m01 * other.m01;
        dest.m02 = this.m02 * other.m02;
        dest.m03 = this.m03;
        dest.m10 = this.m10 * other.m10;
        dest.m11 = this.m11 * other.m11;
        dest.m12 = this.m12 * other.m12;
        dest.m13 = this.m13;
        dest.m20 = this.m20 * other.m20;
        dest.m21 = this.m21 * other.m21;
        dest.m22 = this.m22 * other.m22;
        dest.m23 = this.m23;
        dest.m30 = this.m30 * other.m30;
        dest.m31 = this.m31 * other.m31;
        dest.m32 = this.m32 * other.m32;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Set this matrix to be equivalent to the rotation specified by the given {@link AxisAngle4d}.
     * 
     * @param axisAngle
     *          the {@link AxisAngle4d}
     * @return this
     */
    // public set(AxisAngle4d axisAngle): Matrix4 {
    //     double x = axisAngle.x;
    //     double y = axisAngle.y;
    //     double z = axisAngle.z;
    //     double angle = axisAngle.angle;
    //     double invLength = Math.invsqrt(x * x + y * y + z * z);
    //     x *= invLength;
    //     y *= invLength;
    //     z *= invLength;
    //     double s = Math.sin(angle);
    //     double c = Math.cosFromSin(s, angle);
    //     double omc = 1.0 - c;
    //     _m00(c + x * x * omc).
    //         _m11(c + y * y * omc).
    //         _m22(c + z * z * omc);
    //     double tmp1 = x * y * omc;
    //     double tmp2 = z * s;
    //     _m10(tmp1 - tmp2).
    //         _m01(tmp1 + tmp2);
    //     tmp1 = x * z * omc;
    //     tmp2 = y * s;
    //     _m20(tmp1 + tmp2).
    //         _m02(tmp1 - tmp2);
    //     tmp1 = y * z * omc;
    //     tmp2 = x * s;
    //     _m21(tmp1 - tmp2).
    //         _m12(tmp1 + tmp2).
    //         _m03(0.0).
    //         _m13(0.0).
    //         _m23(0.0).
    //         _m30(0.0).
    //         _m31(0.0).
    //         _m32(0.0).
    //         _m33(1.0).
    //         properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
    //     return this;
    // }

    /**
     * Set this matrix to be equivalent to the rotation - and possibly scaling - specified by the given {@link Quaterniondc}.
     * <p>
     * This method is equivalent to calling: <code>rotation(q)</code>
     * <p>
     * Reference: <a href="http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToMatrix/">http://www.euclideanspace.com/</a>
     * 
     * @see #rotation(Quaterniondc)
     * 
     * @param q
     *          the {@link Quaterniondc}
     * @return this
     */
    public set(q: Quaternion): Matrix4;

    /** Set the values within this matrix to the supplied double values. The matrix will look like this:<br><br>
     *  
     * m00, m10, m20, m30<br>
     * m01, m11, m21, m31<br>
     * m02, m12, m22, m32<br>
     * m03, m13, m23, m33
     *
     * @param m00
     *          the new value of m00
     * @param m01
     *          the new value of m01
     * @param m02
     *          the new value of m02
     * @param m03
     *          the new value of m03
     * @param m10
     *          the new value of m10
     * @param m11
     *          the new value of m11
     * @param m12
     *          the new value of m12
     * @param m13
     *          the new value of m13
     * @param m20
     *          the new value of m20
     * @param m21
     *          the new value of m21
     * @param m22
     *          the new value of m22
     * @param m23
     *          the new value of m23
     * @param m30
     *          the new value of m30
     * @param m31
     *          the new value of m31
     * @param m32
     *          the new value of m32
     * @param m33
     *          the new value of m33
     * @return this
     */
    public set(
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number): Matrix4;

    /**
     * Set the values in the matrix using a double array that contains the matrix elements in column-major order.
     * <p>
     * The results will look like this:<br><br>
     * 
     * 0, 4, 8, 12<br>
     * 1, 5, 9, 13<br>
     * 2, 6, 10, 14<br>
     * 3, 7, 11, 15<br>
     * 
     * @see #set(number[])
     * 
     * @param m
     *          the array to read the matrix values from
     * @param off
     *          the offset into the array
     * @return this
     */
    public set(m: number[], off?: number): Matrix4;

    /**
     * Set the four columns of this matrix to the supplied vectors, respectively.
     * 
     * @param col0
     *          the first column
     * @param col1
     *          the second column
     * @param col2
     *          the third column
     * @param col3
     *          the fourth column
     * @return this
     */
    public set(col0: Vector4, col1: Vector4, col2: Vector4, col3: Vector4): Matrix4;

    /**
     * Store the values of the given matrix <code>m</code> into <code>this</code> matrix.
     * 
     * @see #Matrix4(Matrix4)
     * @see #get(Matrix)
     * 
     * @param m
     *          the matrix to copy the values from
     * @return this
     */
    public set(m: Matrix4): Matrix4;

    /**
     * Set the matrix element at the given column and row to the specified value.
     * 
     * @param column
     *          the colum index in <code>[0..3]</code>
     * @param row
     *          the row index in <code>[0..3]</code>
     * @param value
     *          the value
     * @return this
     */
    public set(column: number, row: number, value: number): Matrix4;

    /**
     * Store the values of the given matrix <code>m</code> into <code>this</code> matrix
     * and set the other matrix elements to identity.
     * 
     * @see #Matrix4d(Matrix4x3dc)
     * 
     * @param m
     *          the matrix to copy the values from
     * @return this
     */
    public set(m: Matrix3): Matrix4;
    public set(m00?: number | number[] | Vector4 | Matrix3 | Matrix4 | Quaternion,
        m01?: number | Vector4, m02?: number | Vector4, m03?: number | Vector4,
        m10?: number, m11?: number, m12?: number, m13?: number,
        m20?: number, m21?: number, m22?: number, m23?: number,
        m30?: number, m31?: number, m32?: number, m33?: number): Matrix4 {
        if (m00 instanceof Quaternion) {
            return this.rotation(m00);
        }
        if (typeof m00 === "number" && typeof m01 === "number" && typeof m02 === "number" && m03 === undefined) {
            this[m00][m01] = m02;
            return this;
        }
        if (typeof m00 === "number" && typeof m01 === "number" && typeof m02 === "number" && typeof m03 === "number") {
            this.m00 = m00; this.m10 = m10; this.m20 = m20; this.m30 = m30;
            this.m01 = m01; this.m11 = m11; this.m21 = m21; this.m31 = m31;
            this.m02 = m02; this.m12 = m12; this.m22 = m22; this.m32 = m32;
            this.m03 = m03; this.m13 = m13; this.m23 = m23; this.m33 = m33;
            return this;
        }
        if (m00 instanceof Matrix4) {
            this.m00 = m00.m00; this.m10 = m00.m10; this.m20 = m00.m20; this.m30 = m00.m30;
            this.m01 = m00.m01; this.m11 = m00.m11; this.m21 = m00.m21; this.m31 = m00.m31;
            this.m02 = m00.m02; this.m12 = m00.m12; this.m22 = m00.m22; this.m32 = m00.m32;
            this.m03 = m00.m03; this.m13 = m00.m13; this.m23 = m00.m23; this.m33 = m00.m33;
            return this;
        }
        if (m00 instanceof Matrix3) {
            this.m00 = m00.m00; this.m10 = m00.m10; this.m20 = m00.m20; this.m30 = 0;
            this.m01 = m00.m01; this.m11 = m00.m11; this.m21 = m00.m21; this.m31 = 0;
            this.m02 = m00.m02; this.m12 = m00.m12; this.m22 = m00.m22; this.m23 = 0;
            this.m03 = 0; this.m13 = 0; this.m32 = 0; this.m33 = 1;
            return this;
        }
        if (m00 instanceof Vector4 && m01 instanceof Vector4
            && m02 instanceof Vector4 && m03 instanceof Vector4) {
            this.m00 = m00.x; this.m10 = m01.x; this.m20 = m02.x; this.m30 = m03.x;
            this.m01 = m00.y; this.m11 = m01.y; this.m21 = m02.y; this.m31 = m03.y;
            this.m02 = m00.z; this.m12 = m01.z; this.m22 = m02.z; this.m32 = m03.z;
            this.m03 = m00.w; this.m13 = m01.w; this.m23 = m02.w; this.m33 = m03.w;
            return this;
        } else { // array set
            const off = (m01 as number) ?? 0;
            m00 = m00 as number[];
            this.m00 = m00[off + 0.]; this.m01 = m00[off + 1.]; this.m02 = m00[off + 2.]; this.m03 = m00[off + 3.];
            this.m10 = m00[off + 4.]; this.m11 = m00[off + 5.]; this.m12 = m00[off + 6.]; this.m13 = m00[off + 7.];
            this.m20 = m00[off + 8.]; this.m21 = m00[off + 9.]; this.m22 = m00[off + 10]; this.m23 = m00[off + 11];
            this.m30 = m00[off + 12]; this.m31 = m00[off + 13]; this.m32 = m00[off + 14]; this.m33 = m00[off + 15];
            return this;
        }
    }


    public determinant(): number {
        if (this.PROPERTY_AFFINE)
            return this.determinantAffine();
        return (this.m00 * this.m11 - this.m01 * this.m10) * (this.m22 * this.m33 - this.m23 * this.m32)
            + (this.m02 * this.m10 - this.m00 * this.m12) * (this.m21 * this.m33 - this.m23 * this.m31)
            + (this.m00 * this.m13 - this.m03 * this.m10) * (this.m21 * this.m32 - this.m22 * this.m31)
            + (this.m01 * this.m12 - this.m02 * this.m11) * (this.m20 * this.m33 - this.m23 * this.m30)
            + (this.m03 * this.m11 - this.m01 * this.m13) * (this.m20 * this.m32 - this.m22 * this.m30)
            + (this.m02 * this.m13 - this.m03 * this.m12) * (this.m20 * this.m31 - this.m21 * this.m30)
    }

    public determinant3x3(): number {
        return (this.m00 * this.m11 - this.m01 * this.m10) * this.m22
            + (this.m02 * this.m10 - this.m00 * this.m12) * this.m21
            + (this.m01 * this.m12 - this.m02 * this.m11) * this.m20;
    }

    public determinantAffine(): number {
        return this.determinant3x3();
    }

    /**
     * Invert this matrix.
     * <p>
     * If <code>this</code> matrix represents an {@link #isAffine() affine} transformation, such as translation, rotation, scaling and shearing,
     * and thus its last row is equal to <code>(0, 0, 0, 1)</code>, then {@link #invertAffine()} can be used instead of this method.
     * 
     * @see #invertAffine()
     * 
     * @return this
     */
    public invert(dest?: Matrix4): Matrix4 {
        if (this.PROPERTY_IDENTITY)
            return dest.identity();
        else if (this.PROPERTY_TRANSLATION)
            return this.invertTranslation(dest);
        else if (this.PROPERTY_ORTHONORMAL)
            return this.invertOrthonormal(dest);
        else if (this.PROPERTY_AFFINE)
            return this.invertAffine(dest);
        else if (this.PROPERTY_PERSPECTIVE)
            return this.invertPerspective(dest);
        return this.invertGeneric(dest);
    }
    private invertTranslation(dest?: Matrix4): Matrix4 {
        if (dest && dest !== this)
            dest.set(this);
        dest.m30 = -this.m30;
        dest.m31 = -this.m31;
        dest.m32 = -this.m32;
        return dest;
    }
    private invertOrthonormal(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m10, this.m20, 0,
            this.m01, this.m11, this.m21, 0,
            this.m02, this.m12, this.m22, 0,

            -(this.m00 * this.m30 + this.m01 * this.m31 + this.m02 * this.m32),
            -(this.m10 * this.m30 + this.m11 * this.m31 + this.m12 * this.m32),
            -(this.m20 * this.m30 + this.m21 * this.m31 + this.m22 * this.m32),
            1
        );
    }
    private invertGeneric(dest: Matrix4): Matrix4 {
        dest = dest ?? this;
        const a = this.m00 * this.m11 - this.m01 * this.m10;
        const b = this.m00 * this.m12 - this.m02 * this.m10;
        const c = this.m00 * this.m13 - this.m03 * this.m10;
        const d = this.m01 * this.m12 - this.m02 * this.m11;
        const e = this.m01 * this.m13 - this.m03 * this.m11;
        const f = this.m02 * this.m13 - this.m03 * this.m12;
        const g = this.m20 * this.m31 - this.m21 * this.m30;
        const h = this.m20 * this.m32 - this.m22 * this.m30;
        const i = this.m20 * this.m33 - this.m23 * this.m30;
        const j = this.m21 * this.m32 - this.m22 * this.m31;
        const k = this.m21 * this.m33 - this.m23 * this.m31;
        const l = this.m22 * this.m33 - this.m23 * this.m32;
        const det = 1 / (a * l - b * k + c * j + d * i - e * h + f * g);
        return dest.set(
            (+ this.m11 * l - this.m12 * k + this.m13 * j) * det,
            (- this.m01 * l + this.m02 * k - this.m03 * j) * det,
            (+ this.m31 * f - this.m32 * e + this.m33 * d) * det,
            (- this.m21 * f + this.m22 * e - this.m23 * d) * det,
            (- this.m10 * l + this.m12 * i - this.m13 * h) * det,
            (+ this.m00 * l - this.m02 * i + this.m03 * h) * det,
            (- this.m30 * f + this.m32 * c - this.m33 * b) * det,
            (+ this.m20 * f - this.m22 * c + this.m23 * b) * det,
            (+ this.m10 * k - this.m11 * i + this.m13 * g) * det,
            (- this.m00 * k + this.m01 * i - this.m03 * g) * det,
            (+ this.m30 * e - this.m31 * c + this.m33 * a) * det,
            (- this.m20 * e + this.m21 * c - this.m23 * a) * det,
            (- this.m10 * j + this.m11 * h - this.m12 * g) * det,
            (+ this.m00 * j - this.m01 * h + this.m02 * g) * det,
            (- this.m30 * d + this.m31 * b - this.m32 * a) * det,
            (+ this.m20 * d - this.m21 * b + this.m22 * a) * det,
        )
    }



    /**
     * If <code>this</code> is a perspective projection matrix obtained via one of the {@link #perspective(double, double, double, double) perspective()} methods
     * or via {@link #setPerspective(double, double, double, double) setPerspective()}, that is, if <code>this</code> is a symmetrical perspective frustum transformation,
     * then this method builds the inverse of <code>this</code>.
     * <p>
     * This method can be used to quickly obtain the inverse of a perspective projection matrix when being obtained via {@link #perspective(double, double, double, double) perspective()}.
     * 
     * @see #perspective(double, double, double, double)
     * 
     * @return this
     */
    public invertPerspective(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const a = 1.0 / (this.m00 * this.m11);
        const l = -1.0 / (this.m23 * this.m32);
        return dest.set(
            this.m11 * a, 0, 0, 0,
            0, this.m00 * a, 0, 0,
            0, 0, 0, -this.m23 * l,
            0, 0, -this.m32 * l, this.m22 * l
        );
    }


    /**
     * If <code>this</code> is an arbitrary perspective projection matrix obtained via one of the {@link #frustum(double, double, double, double, double, double) frustum()}  methods
     * or via {@link #setFrustum(double, double, double, double, double, double) setFrustum()},
     * then this method builds the inverse of <code>this</code>.
     * <p>
     * This method can be used to quickly obtain the inverse of a perspective projection matrix.
     * <p>
     * If this matrix represents a symmetric perspective frustum transformation, as obtained via {@link #perspective(double, double, double, double) perspective()}, then
     * {@link #invertPerspective()} should be used instead.
     * 
     * @see #frustum(double, double, double, double, double, double)
     * @see #invertPerspective()
     * 
     * @return this
     */
    public invertFrustum(dest?: Matrix4): Matrix4 {
        const invM00 = 1.0 / this.m00;
        const invM11 = 1.0 / this.m11;
        const invM23 = 1.0 / this.m23;
        const invM32 = 1.0 / this.m32;
        return dest.set(
            invM00, 0, 0, 0,
            0, invM11, 0, 0,
            0, 0, 0, invM32,

            -this.m20 * invM00 * invM23,
            -this.m21 * invM11 * invM23,
            invM23,
            -this.m22 * invM23 * invM32
        );
    }

    /**
     * Invert <code>this</code> orthographic projection matrix.
     * <p>
     * This method can be used to quickly obtain the inverse of an orthographic projection matrix.
     * 
     * @return this
     */
    public invertOrtho(dest?: Matrix4): Matrix4 {
        const invM00 = 1.0 / this.m00;
        const invM11 = 1.0 / this.m11;
        const invM22 = 1.0 / this.m22;
        return dest.set(
            invM00, 0, 0, 0,
            0, invM11, 0, 0,
            0, 0, invM22, 0,
            -this.m30 * invM00, -this.m31 * invM11, -this.m32 * invM22, 1
        )
    }

    public invertPerspectiveView(view: Matrix4, dest: Matrix4): Matrix4 {
        const a = 1.0 / (this.m00 * this.m11);
        const l = -1.0 / (this.m23 * this.m32);
        const pm00 = this.m11 * a;
        const pm11 = this.m00 * a;
        const pm23 = this.m23 * -l;
        const pm32 = this.m32 * -l;
        const pm33 = this.m22 * l;
        const vm30 = -view.m00 * view.m30 - view.m01 * view.m31 - view.m02 * view.m32;
        const vm31 = -view.m10 * view.m30 - view.m11 * view.m31 - view.m12 * view.m32;
        const vm32 = -view.m20 * view.m30 - view.m21 * view.m31 - view.m22 * view.m32;
        const nm10 = view.m01 * pm11;
        const nm30 = view.m02 * pm32 + vm30 * pm33;
        const nm31 = view.m12 * pm32 + vm31 * pm33;
        const nm32 = view.m22 * pm32 + vm32 * pm33;
        return dest.set(
            view.m00 * pm00,
            view.m10 * pm00,
            view.m20 * pm00,
            0.0,
            nm10,
            view.m11 * pm11,
            view.m21 * pm11,
            0.0,
            vm30 * pm23,
            vm31 * pm23,
            vm32 * pm23,
            pm23,
            nm30, nm31, nm32, pm33,
        )
    }

    /**
     * Invert this matrix by assuming that it is an {@link #isAffine() affine} transformation (i.e. its last row is equal to <code>(0, 0, 0, 1)</code>).
     * 
     * @return this
     */
    public invertAffine(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const m11m00 = this.m00 * this.m11, m10m01 = this.m01 * this.m10, m10m02 = this.m02 * this.m10;
        const m12m00 = this.m00 * this.m12, m12m01 = this.m01 * this.m12, m11m02 = this.m02 * this.m11;
        const s = 1.0 / ((m11m00 - m10m01) * this.m22 + (m10m02 - m12m00) * this.m21 + (m12m01 - m11m02) * this.m20);
        const m10m22 = this.m10 * this.m22, m10m21 = this.m10 * this.m21, m11m22 = this.m11 * this.m22;
        const m11m20 = this.m11 * this.m20, m12m21 = this.m12 * this.m21, m12m20 = this.m12 * this.m20;
        const m20m02 = this.m20 * this.m02, m20m01 = this.m20 * this.m01, m21m02 = this.m21 * this.m02;
        const m21m00 = this.m21 * this.m00, m22m01 = this.m22 * this.m01, m22m00 = this.m22 * this.m00;
        return dest.set(
            (m11m22 - m12m21) * s,
            (m21m02 - m22m01) * s,
            (m12m01 - m11m02) * s,
            0,
            (m12m20 - m10m22) * s,
            (m22m00 - m20m02) * s,
            (m10m02 - m12m00) * s,
            0,
            (m10m21 - m11m20) * s,
            (m20m01 - m21m00) * s,
            (m11m00 - m10m01) * s,
            0,
            (m10m22 * this.m31 - m10m21 * this.m32 + m11m20 * this.m32 - m11m22 * this.m30 + m12m21 * this.m30 - m12m20 * this.m31) * s,
            (m20m02 * this.m31 - m20m01 * this.m32 + m21m00 * this.m32 - m21m02 * this.m30 + m22m01 * this.m30 - m22m00 * this.m31) * s,
            (m11m02 * this.m30 - m12m01 * this.m30 + m12m00 * this.m31 - m10m02 * this.m31 + m10m01 * this.m32 - m11m00 * this.m32) * s,
            1,
        )
    }

    /**
     * Transpose this matrix.
     * 
     * @return this
     */
    public transpose(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m10, this.m20, this.m30,
            this.m01, this.m11, this.m21, this.m31,
            this.m02, this.m12, this.m22, this.m32,
            this.m03, this.m13, this.m23, this.m33,
        )
    }

    /**
     * Transpose only the upper left 3x3 submatrix of this matrix.
     * <p>
     * All other matrix elements are left unchanged.
     * 
     * @return this
     */
    public transpose3x3(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m10, this.m20, dest.m03,
            this.m01, this.m11, this.m21, dest.m13,
            this.m02, this.m12, this.m22, dest.m23,
            dest.m30, dest.m31, dest.m32, dest.m33,
        )
    }

    /**
     * Set this matrix to be a simple translation matrix.
     * <p>
     * The resulting matrix can be multiplied against another transformation
     * matrix to obtain an additional translation.
     * 
     * @param x
     *          the offset to translate in x
     * @param y
     *          the offset to translate in y
     * @param z
     *          the offset to translate in z
     * @return this
     */
    public translation(x: number, y: number, z: number): Matrix4;
    /**
     * Set this matrix to be a simple translation matrix.
     * <p>
     * The resulting matrix can be multiplied against another transformation
     * matrix to obtain an additional translation.
     * 
     * @param offset
     *              the offsets in x, y and z to translate
     * @return this
     */
    public translation(offset: Vector3): Matrix4;
    public translation(x: number | Vector3, y?: number, z?: number): Matrix4 {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        this.identity();
        this.m30 = x;
        this.m31 = y;
        this.m32 = z;
        this.m33 = 1;
        return this;
    }


    /**
     * Set only the translation components <code>(m30, m31, m32)</code> of this matrix to the given values <code>(x, y, z)</code>.
     * <p>
     * To build a translation matrix instead, use {@link #translation(double, double, double)}.
     * To apply a translation, use {@link #translate(double, double, double)}.
     * 
     * @see #translation(double, double, double)
     * @see #translate(double, double, double)
     * 
     * @param x
     *          the units to translate in x
     * @param y
     *          the units to translate in y
     * @param z
     *          the units to translate in z
     * @return this
     */
    public setTranslation(x: number, y: number, z: number): Matrix4;
    /**
     * Set only the translation components <code>(m30, m31, m32)</code> of this matrix to the given values <code>(xyz.x, xyz.y, xyz.z)</code>.
     * <p>
     * To build a translation matrix instead, use {@link #translation(Vector3dc)}.
     * To apply a translation, use {@link #translate(Vector3dc)}.
     * 
     * @see #translation(Vector3dc)
     * @see #translate(Vector3dc)
     * 
     * @param xyz
     *          the units to translate in <code>(x, y, z)</code>
     * @return this
     */
    public setTranslation(xyz: Vector3): Matrix4;
    public setTranslation(x: number | Vector3, y?: number, z?: number): Matrix4 {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        this.m30 = x;
        this.m31 = y;
        this.m32 = z;
        return this;
    }

    public getTranslation(dest?: Vector3): Vector3 {
        dest = dest ?? new Vector3();
        dest.x = this.m30;
        dest.y = this.m31;
        dest.z = this.m32;
        return dest;
    }

    public getScale(dest?: Vector3): Vector3 {
        dest = dest ?? new Vector3();
        dest.x = Math.sqrt(this.m00 * this.m00 + this.m01 * this.m01 + this.m02 * this.m02);
        dest.y = Math.sqrt(this.m10 * this.m10 + this.m11 * this.m11 + this.m12 * this.m12);
        dest.z = Math.sqrt(this.m20 * this.m20 + this.m21 * this.m21 + this.m22 * this.m22);
        return dest;
    }

    /**
     * Return a string representation of this matrix by formatting the matrix elements with the given {@link NumberFormat}.
     * 
     * @param formatter
     *          the {@link NumberFormat} used to format the matrix values with
     * @return the string representation
     */
    public toString(formatter?: (x: number) => string): string {
        formatter = formatter ?? ((x: number) => x.toString());
        return `${formatter(this.m00)} ${formatter(this.m10)} ${formatter(this.m20)} ${formatter(this.m30)} \n`
            + `${formatter(this.m01)} ${formatter(this.m11)} ${formatter(this.m21)} ${formatter(this.m31)} \n`
            + `${formatter(this.m02)} ${formatter(this.m12)} ${formatter(this.m22)} ${formatter(this.m32)} \n`
            + `${formatter(this.m03)} ${formatter(this.m13)} ${formatter(this.m23)} ${formatter(this.m33)} \n`
    }



    public get3x3(dest: Matrix3): Matrix3 {
        dest.m00 = this.m00; dest.m10 = this.m10; dest.m20 = this.m20;
        dest.m01 = this.m01; dest.m11 = this.m11; dest.m21 = this.m21;
        dest.m02 = this.m02; dest.m12 = this.m12; dest.m22 = this.m22;
        return dest;
    }
    public get(dest: Matrix4): Matrix4;

    public get(column: number, row: number): number;
    public get(dest: number[], offset?: number): number[];
    public get(dest: number | number[] | Matrix4, offset?: number): number | number[] | Matrix4 {
        if (dest instanceof Matrix4) {
            return dest.set(this);
        }
        if (typeof dest === "number") {
            return this[dest][offset]; // this[column][row]
        }
        offset = offset ?? 0;
        dest[offset + 0] = this.m00;
        dest[offset + 1] = this.m01;
        dest[offset + 2] = this.m02;
        dest[offset + 3] = this.m03;
        dest[offset + 4] = this.m10;
        dest[offset + 5] = this.m11;
        dest[offset + 6] = this.m12;
        dest[offset + 7] = this.m13;
        dest[offset + 8] = this.m20;
        dest[offset + 9] = this.m21;
        dest[offset + 10] = this.m22;
        dest[offset + 11] = this.m23;
        dest[offset + 12] = this.m30;
        dest[offset + 13] = this.m31;
        dest[offset + 14] = this.m32;
        dest[offset + 15] = this.m33;
        return dest;
    }

    public getUnnormalizedRotation(dest: Quaternion): Quaternion {
        return dest.setFromUnnormalized(this);
    }

    public getNormalizedRotation(dest: Quaternion): Quaternion {
        return dest.setFromNormalized(this);
    }

    /**
     * Set all the values within this matrix to 0.
     * 
     * @return this
     */
    public zero(): Matrix4 {
        this.m00 = 0; this.m10 = 0; this.m20 = 0; this.m30 = 0;
        this.m01 = 0; this.m11 = 0; this.m21 = 0; this.m31 = 0;
        this.m02 = 0; this.m12 = 0; this.m22 = 0; this.m32 = 0;
        this.m03 = 0; this.m13 = 0; this.m23 = 0; this.m33 = 0;
        return this;
    }

    /**
     * Set this matrix to be a simple scale matrix, which scales all axes uniformly by the given factor.
     * <p>
     * The resulting matrix can be multiplied against another transformation
     * matrix to obtain an additional scaling.
     * <p>
     * In order to post-multiply a scaling transformation directly to a
     * matrix, use {@link #scale(double) scale()} instead.
     * 
     * @see #scale(double)
     * 
     * @param factor
     *             the scale factor in x, y and z
     * @return this
     */
    public scaling(factor: number): Matrix4;
    /**
     * Set this matrix to be a simple scale matrix.
     * 
     * @param x
     *          the scale in x
     * @param y
     *          the scale in y
     * @param z
     *          the scale in z         
     * @return this
     */
    public scaling(x: number, y: number, z: number): Matrix4;
    /**
     * Set this matrix to be a simple scale matrix which scales the base axes by
     * <code>xyz.x</code>, <code>xyz.y</code> and <code>xyz.z</code>, respectively.
     * <p>
     * The resulting matrix can be multiplied against another transformation
     * matrix to obtain an additional scaling.
     * <p>
     * In order to post-multiply a scaling transformation directly to a
     * matrix use {@link #scale(Vector3dc) scale()} instead.
     * 
     * @see #scale(Vector3dc)
     * 
     * @param xyz
     *             the scale in x, y and z, respectively
     * @return this
     */
    public scaling(xyz: Vector3): Matrix4;
    public scaling(x: number | Vector3, y?: number, z?: number): Matrix4 {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else if (y === undefined || z === undefined) {
            z = x, y = x;
        }
        this.identity();
        this.m00 = x;
        this.m11 = y;
        this.m22 = z;
        return this;
    }

    /**
     * Set this matrix to a rotation transformation using the given {@link AxisAngle4}.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * The resulting matrix can be multiplied against another transformation
     * matrix to obtain an additional rotation.
     * <p>
     * In order to apply the rotation transformation to an existing transformation,
     * use {@link #rotate(AxisAngle4) rotate()} instead.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Axis_and_angle">http://en.wikipedia.org</a>
     *
     * @see #rotate(AxisAngle4)
     * 
     * @param angleAxis
     *          the {@link AxisAngle4} (needs to be {@link AxisAngle4#normalize() normalized})
     * @return this
     */
    public rotation(angleAxis: AxisAngle4): Matrix4;
    /**
     * Set this matrix to the rotation - and possibly scaling - transformation of the given {@link Quaterniondc}.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * The resulting matrix can be multiplied against another transformation
     * matrix to obtain an additional rotation.
     * <p>
     * In order to apply the rotation transformation to an existing transformation,
     * use {@link #rotate(Quaterniondc) rotate()} instead.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @see #rotate(Quaterniondc)
     * 
     * @param quat
     *          the {@link Quaterniondc}
     * @return this
     */
    public rotation(quat: Quaternion): Matrix4;
    /**
     * Set this matrix to a rotation matrix which rotates the given radians about a given axis.
     * <p>
     * The axis described by the <code>axis</code> vector needs to be a unit vector.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * 
     * @param angle
     *          the angle in radians
     * @param axis
     *          the axis to rotate about
     * @return this
     */
    public rotation(angle: number, axis: Vector3): Matrix4;
    /**
     * Set this matrix to a rotation matrix which rotates the given radians about a given axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * From <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">Wikipedia</a>
     * 
     * @param angle
     *          the angle in radians
     * @param x
     *          the x-coordinate of the axis to rotate about
     * @param y
     *          the y-coordinate of the axis to rotate about
     * @param z
     *          the z-coordinate of the axis to rotate about
     * @return this
     */

    public rotation(angle: number, x: number, y: number, z: number): Matrix4
    public rotation(angle: number | AxisAngle4 | Quaternion, x?: number | Vector3, y?: number, z?: number): Matrix4 {
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (angle instanceof Quaternion) {
            return this.rotationQuaternion(angle);
        } else if (angle instanceof AxisAngle4) {
            z = angle.z, y = angle.y, x = angle.x, angle = angle.angle;
        }

        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return this.rotationX(x * angle);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return this.rotationY(y * angle);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return this.rotationZ(z * angle);
        return this.rotationInternal(angle, x, y, z);
    }
    private rotationQuaternion(quat: Quaternion): Matrix4 {
        const w2 = quat.w * quat.w;
        const x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y;
        const z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw;
        const xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz;
        const yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz;
        const xw = quat.x * quat.w, dxw = xw + xw;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = w2 + x2 - z2 - y2;
        this.m01 = dxy + dzw;
        this.m02 = dxz - dyw;
        this.m10 = -dzw + dxy;
        this.m11 = y2 - z2 + w2 - x2;
        this.m12 = dyz + dxw;
        this.m20 = dyw + dxz;
        this.m21 = dyz - dxw;
        this.m22 = z2 - y2 - x2 + w2;
        return this;
    }
    private rotationInternal(angle: number, x: number, y: number, z: number): Matrix4 {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const C = 1.0 - cos;
        const xy = x * y, xz = x * z, yz = y * z;

        this.identity();
        this.m00 = cos + x * x * C;
        this.m10 = xy * C - z * sin;
        this.m20 = xz * C + y * sin;
        this.m01 = xy * C + z * sin;
        this.m11 = cos + y * y * C;
        this.m21 = yz * C - x * sin;
        this.m02 = xz * C - y * sin;
        this.m12 = yz * C + x * sin;
        this.m22 = cos + z * z * C;

        return this;
    }

    /**
     * Set this matrix to a rotation transformation about the X axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations">http://en.wikipedia.org</a>
     * 
     * @param ang
     *            the angle in radians
     * @return this
     */
    public rotationX(ang: number): Matrix4 {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        this.identity();
        this.m11 = cos;
        this.m12 = sin;
        this.m21 = -sin;
        this.m22 = cos;
        return this;
    }

    /**
     * Set this matrix to a rotation transformation about the Y axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations">http://en.wikipedia.org</a>
     * 
     * @param ang
     *            the angle in radians
     * @return this
     */
    public rotationY(ang: number): Matrix4 {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        this.identity();
        this.m00 = cos;
        this.m02 = -sin;
        this.m20 = sin;
        this.m22 = cos;
        return this;
    }

    /**
     * Set this matrix to a rotation transformation about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations">http://en.wikipedia.org</a>
     * 
     * @param ang
     *            the angle in radians
     * @return this
     */
    public rotationZ(ang: number): Matrix4 {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        this.identity();
        this.m00 = cos;
        this.m01 = sin;
        this.m10 = -sin;
        this.m11 = cos;
        return this;
    }

    /**
     * Set this matrix to a rotation transformation about the Z axis to align the local <code>+X</code> towards <code>(dirX, dirY)</code>.
     * <p>
     * The vector <code>(dirX, dirY)</code> must be a unit vector.
     * 
     * @param dirX
     *            the x component of the normalized direction
     * @param dirY
     *            the y component of the normalized direction
     * @return this
     */
    public rotationTowardsXY(dirX: number, dirY: number): Matrix4 {
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = dirY;
        this.m01 = dirX;
        this.m10 = -dirX;
        this.m11 = dirY;
        return this;
    }

    /**
     * Set this matrix to a rotation of <code>angleX</code> radians about the X axis, followed by a rotation
     * of <code>angleY</code> radians about the Y axis and followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>rotationX(angleX).rotateY(angleY).rotateZ(angleZ)</code>
     * 
     * @param angleX
     *            the angle to rotate about X
     * @param angleY
     *            the angle to rotate about Y
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public rotationXYZ(angleX: number, angleY: number, angleZ: number) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        return this.set(
            cosY * cosZ,
            sinX * sinY * cosZ + cosX * sinZ,
            cosX * -sinY * cosZ + sinX * sinZ,
            0,
            cosY * -sinZ,
            sinX * sinY * -sinZ + cosX * cosZ,
            cosX * sinY * sinZ + sinX * cosZ,
            0,
            sinY,
            -sinX * cosY,
            cosX * cosY,
            0,
            0, 0, 0, 1,
        )
    }

    /**
     * Set this matrix to a rotation of <code>angleZ</code> radians about the Z axis, followed by a rotation
     * of <code>angleY</code> radians about the Y axis and followed by a rotation of <code>angleX</code> radians about the X axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>rotationZ(angleZ).rotateY(angleY).rotateX(angleX)</code>
     * 
     * @param angleZ
     *            the angle to rotate about Z
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @return this
     */
    public rotationZYX(angleZ: number, angleY: number, angleX: number): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        return this.set(
            cosZ * cosY,
            sinZ * cosY,
            -sinY,
            0,
            -sinZ * cosX + cosZ * sinY * sinX,
            cosZ * cosX + sinZ * sinY * sinX,
            cosY * sinX,
            0,
            sinZ * sinX + cosZ * sinY * cosX,
            cosZ * -sinX + sinZ * sinY * cosX,
            cosY * cosX,
            0,
            0, 0, 0, 1,
        );
    }

    /**
     * Set this matrix to a rotation of <code>angleY</code> radians about the Y axis, followed by a rotation
     * of <code>angleX</code> radians about the X axis and followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>rotationY(angleY).rotateX(angleX).rotateZ(angleZ)</code>
     * 
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public rotationYXZ(angleY: number, angleX: number, angleZ: number): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        return this.set(
            cosY * cosZ + sinY * sinX * sinZ,
            cosX * sinZ,
            -sinY * cosZ + cosY * sinX * sinZ,
            0,
            cosY * -sinZ + sinY * sinX * cosZ,
            cosX * cosZ,
            sinY * sinZ + cosY * sinX * cosZ,
            0,
            sinY * cosX,
            -sinX,
            cosY * cosX,
            0,
            0, 0, 0, 1,
        )
    }

    /**
     * Set only the upper left 3x3 submatrix of this matrix to a rotation of <code>angleX</code> radians about the X axis, followed by a rotation
     * of <code>angleY</code> radians about the Y axis and followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * 
     * @param angleX
     *            the angle to rotate about X
     * @param angleY
     *            the angle to rotate about Y
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public setRotationXYZ(angleX: number, angleY: number, angleZ: number): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        return this.set(
            cosY * cosZ,
            sinX * sinY * cosZ + cosX * sinZ,
            cosX * -sinY * cosZ + sinX * sinZ,
            this.m03,
            cosY * -sinZ,
            sinX * sinY * -sinZ + cosX * cosZ,
            cosX * sinY * sinZ + sinX * cosZ,
            this.m13,
            sinY,
            -sinX * cosY,
            cosX * cosY,
            this.m23,
            this.m30, this.m31, this.m32, this.m33,
        )
    }

    /**
     * Set only the upper left 3x3 submatrix of this matrix to a rotation of <code>angleZ</code> radians about the Z axis, followed by a rotation
     * of <code>angleY</code> radians about the Y axis and followed by a rotation of <code>angleX</code> radians about the X axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * 
     * @param angleZ
     *            the angle to rotate about Z
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @return this
     */
    public setRotationZYX(angleZ: number, angleY: number, angleX: number): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        return this.set(
            cosZ * cosY,
            sinZ * cosY,
            -sinY,
            this.m03,
            -sinZ * cosX + cosZ * sinY * sinX,
            cosZ * cosX + sinZ * sinY * sinX,
            cosY * sinX,
            this.m13,
            sinZ * sinX + cosZ * sinY * cosX,
            cosZ * -sinX + sinZ * sinY * cosX,
            cosY * cosX,
            this.m23,
            this.m30, this.m31, this.m32, this.m33,
        );
    }

    /**
     * Set only the upper left 3x3 submatrix of this matrix to a rotation of <code>angleY</code> radians about the Y axis, followed by a rotation
     * of <code>angleX</code> radians about the X axis and followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * 
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public setRotationYXZ(angleY: number, angleX: number, angleZ: number): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        return this.set(
            cosY * cosZ + sinY * sinX * sinZ,
            cosX * sinZ,
            -sinY * cosZ + cosY * sinX * sinZ,
            this.m03,
            cosY * -sinZ + sinY * sinX * cosZ,
            cosX * cosZ,
            sinY * sinZ + cosY * sinX * cosZ,
            this.m13,
            sinY * cosX,
            -sinX,
            cosY * cosX,
            this.m23,
            this.m30, this.m31, this.m32, this.m33,
        )
    }


    public transform(v: Vector4, dest?: Vector4): Vector4;

    public transform(x: number, y: number, z: number, w: number, dest?: Vector4): Vector4;

    public transform(x: number | Vector4, y?: number | Vector4, z?: number, w?: number, dest?: Vector4): Vector4 {
        if (x instanceof Vector4) { // (Vector4, Vector4);
            return x.mul(this, y as Vector4);
        }
        dest = dest ?? new Vector4();
        return dest.set(x, y as number, z, w).mul(this);
    }


    public transformTranspose(v: Vector4, dest?: Vector4): Vector4;

    public transformTranspose(x: number, y: number, z: number, w: number, dest?: Vector4): Vector4;

    public transformTranspose(x: number | Vector4, y?: number | Vector4, z?: number, w?: number, dest?: Vector4): Vector4 {
        if (x instanceof Vector4) { // (Vector4, Vector4);
            return x.mulTranspose(this, y as Vector4);
        }
        dest = dest ?? new Vector4();
        return dest.set(x, y as number, z, w).mulTranspose(this);
    }

    public transformProject(v: Vector4, dest?: Vector4): Vector4;
    public transformProject(x: number, y: number, z: number, w: number, dest?: Vector4): Vector4;
    public transformProject(v: Vector3, dest?: Vector3): Vector3;
    public transformProject(v: Vector4, dest: Vector3): Vector3;
    public transformProject(x: number, y: number, z: number, w: number, dest?: Vector3): Vector3;
    public transformProject(x: number | Vector3 | Vector4, y?: number | Vector3 | Vector4, z?: number, w?: number, dest?: Vector3 | Vector4): Vector3 | Vector4 {
        dest = dest ?? (typeof y !== "number" ? y : new Vector4());
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (x instanceof Vector4) {
            w = x.w, z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }

        if (dest instanceof Vector3) {
            return dest.set(x, y, z).mulProject(this, w);
        } else {
            return dest.set(x, y, z).mulProject(this);
        }
    }

    public transformPosition(v: Vector3, dest?: Vector3): Vector3
    public transformPosition(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public transformPosition(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        if (x instanceof Vector3) {
            return x.mulPosition(this, y as Vector3);
        }
        dest = dest ?? new Vector3();
        return dest.set(x, y as number, z).mulPosition(this);
    }

    public transformDirection(v: Vector3, dest?: Vector3): Vector3;
    public transformDirection(x: number, y: number, z: number, dest?: Vector3): Vector3;
    public transformDirection(x: number | Vector3, y?: number | Vector3, z?: number, dest?: Vector3): Vector3 {
        if (x instanceof Vector3) {
            return x.mulDirection(this, y as Vector3);
        }
        dest = dest ?? new Vector3();
        return dest.set(x, y as number, z).mulDirection(this);
    }

    public transformAffine(v: Vector4, dest?: Vector4): Vector4;
    public transformAffine(x: number, y: number, z: number, w: number, dest: Vector4): Vector4;
    public transformAffine(x: number | Vector4, y?: number | Vector4, z?: number, w?: number, dest?: Vector4): Vector4 {
        if (x instanceof Vector4) {
            return x.mulAffine(this, y as Vector4);
        }
        dest = dest ?? new Vector4();
        return dest.set(x, y as number, z, w).mulAffine(this);
    }

    /**
     * Apply scaling to this matrix by scaling the base axes by the given <code>xyz.x</code>,
     * <code>xyz.y</code> and <code>xyz.z</code> factors, respectively.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * scaling will be applied first!
     * 
     * @param xyz
     *            the factors of the x, y and z component, respectively
     * @return this
     */
    public scale(xyz: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply scaling to this matrix by uniformly scaling all base axes by the given xyz factor.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>
     * , the scaling will be applied first!
     * 
     * @see #scale(double, double, double)
     * 
     * @param xyz
     *            the factor for all components
     * @return this
     */
    public scale(xyz: number, dest?: Matrix4): Matrix4;

    /**
     * Apply scaling to <code>this</code> matrix by scaling the base axes by the given x,
     * y and z factors.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>
     * , the scaling will be applied first!
     * 
     * @param x
     *            the factor of the x component
     * @param y
     *            the factor of the y component
     * @param z
     *            the factor of the z component
     * @return this
     */
    public scale(x: number, y: number, z: number, dest?: Matrix4): Matrix4;
    public scale(x: number | Vector3, y?: number | Matrix4, z?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (y instanceof Matrix4 ? y : this);

        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else if (z === undefined) {
            z = x, y = x, x = x;
        } else {
            y = y as number;
        }

        dest = dest ?? this;
        dest.m00 = this.m00 * x
        dest.m01 = this.m01 * x
        dest.m02 = this.m02 * x
        dest.m03 = this.m03 * x
        dest.m10 = this.m10 * y
        dest.m11 = this.m11 * y
        dest.m12 = this.m12 * y
        dest.m13 = this.m13 * y
        dest.m20 = this.m20 * z
        dest.m21 = this.m21 * z
        dest.m22 = this.m22 * z
        dest.m23 = this.m23 * z
        dest.m30 = this.m30
        dest.m31 = this.m31
        dest.m32 = this.m32
        dest.m33 = this.m33
        return dest;
    }

    /**
     * Apply scaling to this matrix by scaling the X axis by <code>x</code> and the Y axis by <code>y</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * scaling will be applied first!
     * 
     * @param x
     *            the factor of the x component
     * @param y
     *            the factor of the y component
     * @return this
     */
    public scaleXY(x: number, y: number, dest?: Matrix4): Matrix4 {
        return this.scale(x, y, 1, dest);
    }


    /**
     * Apply scaling to this matrix by scaling the base axes by the given sx,
     * sy and sz factors while using <code>(ox, oy, oz)</code> as the scaling origin.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * scaling will be applied first!
     * <p>
     * This method is equivalent to calling: <code>translate(ox, oy, oz).scale(sx, sy, sz).translate(-ox, -oy, -oz)</code>
     * 
     * @param sx
     *            the scaling factor of the x component
     * @param sy
     *            the scaling factor of the y component
     * @param sz
     *            the scaling factor of the z component
     * @param ox
     *            the x coordinate of the scaling origin
     * @param oy
     *            the y coordinate of the scaling origin
     * @param oz
     *            the z coordinate of the scaling origin
     * @return this
     */
    public scaleAround(sx: number, sy: number, sz: number, ox: number, oy: number, oz: number, dest?: Matrix4): Matrix4;

    /**
     * Apply scaling to this matrix by scaling all three base axes by the given <code>factor</code>
     * while using <code>(ox, oy, oz)</code> as the scaling origin.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * scaling will be applied first!
     * <p>
     * This method is equivalent to calling: <code>translate(ox, oy, oz).scale(factor).translate(-ox, -oy, -oz)</code>
     * 
     * @param factor
     *            the scaling factor for all three axes
     * @param ox
     *            the x coordinate of the scaling origin
     * @param oy
     *            the y coordinate of the scaling origin
     * @param oz
     *            the z coordinate of the scaling origin
     * @return this
     */
    public scaleAround(factor: number, ox: number, oy: number, oz: number, dest?: Matrix4): Matrix4;
    public scaleAround(sx: number, sy: number, sz: number, ox: number, oy?: number | Matrix4, oz?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (oy instanceof Matrix4 ? oy : this);
        if (oy instanceof Matrix4 || oy === undefined) {
            oz = ox, oy = sz, ox = sy;
            sz = sx, sy = sx, sx = sx;
        }

        const nm30 = this.m00 * ox + this.m10 * oy + this.m20 * oz + this.m30;
        const nm31 = this.m01 * ox + this.m11 * oy + this.m21 * oz + this.m31;
        const nm32 = this.m02 * ox + this.m12 * oy + this.m22 * oz + this.m32;
        const nm33 = this.m03 * ox + this.m13 * oy + this.m23 * oz + this.m33;
        return dest.set(
            this.m00 * sx, this.m01 * sx, this.m02 * sx, this.m03 * sx,
            this.m10 * sy, this.m11 * sy, this.m12 * sy, this.m13 * sy,
            this.m20 * sz, this.m21 * sz, this.m22 * sz, this.m23 * sz,
            -dest.m00 * ox - dest.m10 * oy - dest.m20 * oz + nm30, // col 3
            -dest.m01 * ox - dest.m11 * oy - dest.m21 * oz + nm31,
            -dest.m02 * ox - dest.m12 * oy - dest.m22 * oz + nm32,
            -dest.m03 * ox - dest.m13 * oy - dest.m23 * oz + nm33,
        )
    }

    /**
     * Pre-multiply scaling to this matrix by scaling the base axes by the given xyz factor.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>S * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>S * M * v</code>, the
     * scaling will be applied last!
     * 
     * @param xyz
     *            the factor of the x, y and z component
     * @return this
     */
    public scaleLocal(xyz: number, dest?: Matrix4): Matrix4;

    /**
     * Pre-multiply scaling to this matrix by scaling the base axes by the given x,
     * y and z factors.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>S * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>S * M * v</code>, the
     * scaling will be applied last!
     * 
     * @param x
     *            the factor of the x component
     * @param y
     *            the factor of the y component
     * @param z
     *            the factor of the z component
     * @return this
     */
    public scaleLocal(x: number, y: number, z: number, dest?: Matrix4): Matrix4;
    public scaleLocal(x: number, y?: number | Matrix4, z?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (y instanceof Matrix4) {
            z = x, y = z;
        }
        return dest.set(
            x * this.m00, y * this.m01, z * this.m02, this.m03,
            x * this.m10, y * this.m11, z * this.m12, this.m13,
            x * this.m20, y * this.m21, z * this.m22, this.m23,
            x * this.m30, y * this.m31, z * this.m32, this.m33,
        )
    }

    /**
     * Pre-multiply scaling to this matrix by scaling the base axes by the given sx,
     * sy and sz factors while using <code>(ox, oy, oz)</code> as the scaling origin.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>S * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>S * M * v</code>, the
     * scaling will be applied last!
     * <p>
     * This method is equivalent to calling: <code>new Matrix4d().translate(ox, oy, oz).scale(sx, sy, sz).translate(-ox, -oy, -oz).mul(this, this)</code>
     * 
     * @param sx
     *            the scaling factor of the x component
     * @param sy
     *            the scaling factor of the y component
     * @param sz
     *            the scaling factor of the z component
     * @param ox
     *            the x coordinate of the scaling origin
     * @param oy
     *            the y coordinate of the scaling origin
     * @param oz
     *            the z coordinate of the scaling origin
     * @return this
     */
    public scaleAroundLocal(sx: number, sy: number, sz: number, ox: number, oy: number, oz: number, dest?: Matrix4): Matrix4;

    /**
     * Pre-multiply scaling to this matrix by scaling all three base axes by the given <code>factor</code>
     * while using <code>(ox, oy, oz)</code> as the scaling origin.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the scaling matrix,
     * then the new matrix will be <code>S * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>S * M * v</code>, the
     * scaling will be applied last!
     * <p>
     * This method is equivalent to calling: <code>new Matrix4d().translate(ox, oy, oz).scale(factor).translate(-ox, -oy, -oz).mul(this, this)</code>
     * 
     * @param factor
     *            the scaling factor for all three axes
     * @param ox
     *            the x coordinate of the scaling origin
     * @param oy
     *            the y coordinate of the scaling origin
     * @param oz
     *            the z coordinate of the scaling origin
     * @return this
     */
    public scaleAroundLocal(factor: number, ox: number, oy: number, oz: number, dest?: Matrix4): Matrix4;

    public scaleAroundLocal(sx: number, sy: number, sz: number, ox: number, oy?: number | Matrix4, oz?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (oy instanceof Matrix4 ? oy : this);
        if (oy instanceof Matrix4 || oy === undefined) {
            oz = ox, oy = sz, ox = sy;
            sz = sx, sy = sx, sx = sx;
        }
        dest.m00 = sx * (this.m00 - ox * this.m03) + ox * this.m03
        dest.m01 = sy * (this.m01 - oy * this.m03) + oy * this.m03
        dest.m02 = sz * (this.m02 - oz * this.m03) + oz * this.m03
        dest.m03 = this.m03
        dest.m10 = sx * (this.m10 - ox * this.m13) + ox * this.m13
        dest.m11 = sy * (this.m11 - oy * this.m13) + oy * this.m13
        dest.m12 = sz * (this.m12 - oz * this.m13) + oz * this.m13
        dest.m13 = this.m13
        dest.m20 = sx * (this.m20 - ox * this.m23) + ox * this.m23
        dest.m21 = sy * (this.m21 - oy * this.m23) + oy * this.m23
        dest.m22 = sz * (this.m22 - oz * this.m23) + oz * this.m23
        dest.m23 = this.m23
        dest.m30 = sx * (this.m30 - ox * this.m33) + ox * this.m33
        dest.m31 = sy * (this.m31 - oy * this.m33) + oy * this.m33
        dest.m32 = sz * (this.m32 - oz * this.m33) + oz * this.m33
        dest.m33 = this.m33
        return dest;
    }

    /**
     * Apply a rotation transformation, rotating the given radians about the specified axis and store the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>A</code> the rotation matrix obtained from the given angle and axis,
     * then the new matrix will be <code>M * A</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * A * v</code>,
     * the axis-angle rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying,
     * use {@link #rotation(double, Vector3dc)}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotate(double, double, double, double)
     * @see #rotation(double, Vector3dc)
     * 
     * @param angle
     *          the angle in radians
     * @param axis
     *          the rotation axis (needs to be {@link Vector3d#normalize() normalized})
     * @param dest
     *          will hold the result
     * @return dest
     */
    public rotate(angle: number, axis: Vector3, dest?: Matrix4): Matrix4;
    /**
     * Apply rotation to this matrix by rotating the given amount of radians
     * about the given axis specified as x, y and z components.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>
     * , the rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation matrix without post-multiplying the rotation
     * transformation, use {@link #rotation(double, double, double, double) rotation()}.
     * 
     * @see #rotation(double, double, double, double)
     *  
     * @param ang
     *            the angle is in radians
     * @param x
     *            the x component of the axis
     * @param y
     *            the y component of the axis
     * @param z
     *            the z component of the axis
     * @return this
     */
    public rotate(ang: number, x: number, y: number, z: number, dest?: Matrix4): Matrix4;
    public rotate(ang: number, x: number | Vector3, y?: number | Matrix4, z?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }

        if (this.PROPERTY_IDENTITY)
            return dest.rotation(ang, x, y, z);
        else if (this.PROPERTY_TRANSLATION)
            return this.rotateTranslation(ang, x, y, z, dest);
        else if (this.PROPERTY_AFFINE)
            return this.rotateAffine(ang, x, y, z, dest);
        return this.rotateGeneric(ang, x, y, z, dest);
    }
    private rotateGeneric(ang: number, x: number, y: number, z: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return this.rotateX(x * ang, dest);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return this.rotateY(y * ang, dest);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return this.rotateZ(z * ang, dest);

        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const rm00 = xx * C + c;
        const rm01 = xy * C + z * s;
        const rm02 = xz * C - y * s;
        const rm10 = xy * C - z * s;
        const rm11 = yy * C + c;
        const rm12 = yz * C + x * s;
        const rm20 = xz * C + y * s;
        const rm21 = yz * C - x * s;
        const rm22 = zz * C + c;
        const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02;
        const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02;
        const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02;
        const nm03 = this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02;
        const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12;
        const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12;
        const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12;
        const nm13 = this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12;
        dest.m20 = (this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22)
        dest.m21 = (this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22)
        dest.m22 = (this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22)
        dest.m23 = (this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22)
        dest.m00 = (nm00)
        dest.m01 = (nm01)
        dest.m02 = (nm02)
        dest.m03 = (nm03)
        dest.m10 = (nm10)
        dest.m11 = (nm11)
        dest.m12 = (nm12)
        dest.m13 = (nm13)
        dest.m30 = (this.m30)
        dest.m31 = (this.m31)
        dest.m32 = (this.m32)
        dest.m33 = (this.m33)
        return dest;
    }

    /**
     * Apply rotation to this matrix, which is assumed to only contain a translation, by rotating the given amount of radians
     * about the specified <code>(x, y, z)</code> axis and store the result in <code>dest</code>.
     * <p>
     * This method assumes <code>this</code> to only contain a translation.
     * <p>
     * The axis described by the three components needs to be a unit vector.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation matrix without post-multiplying the rotation
     * transformation, use {@link #rotation(double, double, double, double) rotation()}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotation(double, double, double, double)
     * 
     * @param ang
     *            the angle in radians
     * @param x
     *            the x component of the axis
     * @param y
     *            the y component of the axis
     * @param z
     *            the z component of the axis
     * @param dest
     *            will hold the result
     * @return dest
     */
    public rotateTranslation(ang: number, x: number, y: number, z: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return dest.rotationX(x * ang).setTranslation(this.m30, this.m31, this.m32);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return dest.rotationY(y * ang).setTranslation(this.m30, this.m31, this.m32);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return dest.rotationZ(z * ang).setTranslation(this.m30, this.m31, this.m32);

        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const rm00 = xx * C + c;
        const rm01 = xy * C + z * s;
        const rm02 = xz * C - y * s;
        const rm10 = xy * C - z * s;
        const rm11 = yy * C + c;
        const rm12 = yz * C + x * s;
        const rm20 = xz * C + y * s;
        const rm21 = yz * C - x * s;
        const rm22 = zz * C + c;
        // set non-dependent values directly
        dest.m20 = rm20;
        dest.m21 = rm21;
        dest.m22 = rm22;
        // set other values
        dest.m00 = rm00;
        dest.m01 = rm01;
        dest.m02 = rm02;
        dest.m03 = 0.0;
        dest.m10 = rm10;
        dest.m11 = rm11;
        dest.m12 = rm12;
        dest.m13 = 0.0;
        dest.m30 = this.m30;
        dest.m31 = this.m31;
        dest.m32 = this.m32;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Apply rotation to this {@link #isAffine() affine} matrix by rotating the given amount of radians
     * about the specified <code>(x, y, z)</code> axis and store the result in <code>dest</code>.
     * <p>
     * This method assumes <code>this</code> to be {@link #isAffine() affine}.
     * <p>
     * The axis described by the three components needs to be a unit vector.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation matrix without post-multiplying the rotation
     * transformation, use {@link #rotation(double, double, double, double) rotation()}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotation(double, double, double, double)
     * 
     * @param ang
     *            the angle in radians
     * @param x
     *            the x component of the axis
     * @param y
     *            the y component of the axis
     * @param z
     *            the z component of the axis
     * @param dest
     *            will hold the result
     * @return dest
     */
    public rotateAffine(ang: number, x: number, y: number, z: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (y === 0 && z === 0 && Math.abs(x) === 1)
            return this.rotateX(x * ang, dest);
        else if (x === 0 && z === 0 && Math.abs(y) === 1)
            return this.rotateY(y * ang, dest);
        else if (x === 0 && y === 0 && Math.abs(z) === 1)
            return this.rotateZ(z * ang, dest);

        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const rm00 = xx * C + c;
        const rm01 = xy * C + z * s;
        const rm02 = xz * C - y * s;
        const rm10 = xy * C - z * s;
        const rm11 = yy * C + c;
        const rm12 = yz * C + x * s;
        const rm20 = xz * C + y * s;
        const rm21 = yz * C - x * s;
        const rm22 = zz * C + c;
        // add temporaries for dependent values
        const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02;
        const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02;
        const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02;
        const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12;
        const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12;
        const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12;
        // set non-dependent values directly
        dest.m20 = (this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22)
        dest.m21 = (this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22)
        dest.m22 = (this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22)
        dest.m23 = (0.0)
        // set other values
        dest.m00 = (nm00)
        dest.m01 = (nm01)
        dest.m02 = (nm02)
        dest.m03 = (0.0)
        dest.m10 = (nm10)
        dest.m11 = (nm11)
        dest.m12 = (nm12)
        dest.m13 = (0.0)
        dest.m30 = (this.m30)
        dest.m31 = (this.m31)
        dest.m32 = (this.m32)
        dest.m33 = (this.m33)
        return dest;
    }

    /**
     * Apply the rotation transformation of the given {@link Quaterniondc} to this matrix while using <code>(ox, oy, oz)</code> as the rotation origin.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>Q</code> the rotation matrix obtained from the given quaternion,
     * then the new matrix will be <code>M * Q</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * Q * v</code>,
     * the quaternion rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>translate(ox, oy, oz).rotate(quat).translate(-ox, -oy, -oz)</code>
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @param quat
     *          the {@link Quaterniondc}
     * @param ox
     *          the x coordinate of the rotation origin
     * @param oy
     *          the y coordinate of the rotation origin
     * @param oz
     *          the z coordinate of the rotation origin
     * @return this
     */
    public rotateAroundAffine(quat: Quaternion, ox: number, oy: number, oz: number, dest?: Matrix4) {
        dest = dest ?? this;
        const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
        const rm00 = w2 + x2 - z2 - y2;
        const rm01 = dxy + dzw;
        const rm02 = dxz - dyw;
        const rm10 = -dzw + dxy;
        const rm11 = y2 - z2 + w2 - x2;
        const rm12 = dyz + dxw;
        const rm20 = dyw + dxz;
        const rm21 = dyz - dxw;
        const rm22 = z2 - y2 - x2 + w2;
        const tm30 = this.m00 * ox + this.m10 * oy + this.m20 * oz + this.m30;
        const tm31 = this.m01 * ox + this.m11 * oy + this.m21 * oz + this.m31;
        const tm32 = this.m02 * ox + this.m12 * oy + this.m22 * oz + this.m32;
        const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02;
        const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02;
        const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02;
        const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12;
        const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12;
        const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12;

        dest.m20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22;
        dest.m21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22;
        dest.m22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22;
        dest.m23 = 0.0;
        dest.m00 = nm00;
        dest.m01 = nm01;
        dest.m02 = nm02;
        dest.m03 = 0.0;
        dest.m10 = nm10;
        dest.m11 = nm11;
        dest.m12 = nm12;
        dest.m13 = 0.0;
        dest.m30 = -nm00 * ox - nm10 * oy - this.m20 * oz + tm30;
        dest.m31 = -nm01 * ox - nm11 * oy - this.m21 * oz + tm31;
        dest.m32 = -nm02 * ox - nm12 * oy - this.m22 * oz + tm32;
        dest.m33 = 1.0;
        return dest;
    }

    public rotateAround(quat: Quaternion, ox: number, oy: number, oz: number, dest: Matrix4): Matrix4 {
        if (this.PROPERTY_IDENTITY)
            return this.rotationAround(quat, ox, oy, oz);
        else if (this.PROPERTY_AFFINE)
            return this.rotateAroundAffine(quat, ox, oy, oz, this);
        return this.rotateAroundGeneric(quat, ox, oy, oz, this);
    }
    private rotateAroundGeneric(quat: Quaternion, ox: number, oy: number, oz: number, dest: Matrix4): Matrix4 {
        const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
        const rm00 = w2 + x2 - z2 - y2;
        const rm01 = dxy + dzw;
        const rm02 = dxz - dyw;
        const rm10 = -dzw + dxy;
        const rm11 = y2 - z2 + w2 - x2;
        const rm12 = dyz + dxw;
        const rm20 = dyw + dxz;
        const rm21 = dyz - dxw;
        const rm22 = z2 - y2 - x2 + w2;
        const tm30 = this.m00 * ox + this.m10 * oy + this.m20 * oz + this.m30;
        const tm31 = this.m01 * ox + this.m11 * oy + this.m21 * oz + this.m31;
        const tm32 = this.m02 * ox + this.m12 * oy + this.m22 * oz + this.m32;
        const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02;
        const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02;
        const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02;
        const nm03 = this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02;
        const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12;
        const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12;
        const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12;
        const nm13 = this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12;

        dest.m20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22;
        dest.m21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22;
        dest.m22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22;
        dest.m23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22;
        dest.m00 = nm00;
        dest.m01 = nm01;
        dest.m02 = nm02;
        dest.m03 = nm03;
        dest.m10 = nm10;
        dest.m11 = nm11;
        dest.m12 = nm12;
        dest.m13 = nm13;
        dest.m30 = -nm00 * ox - nm10 * oy - this.m20 * oz + tm30;
        dest.m31 = -nm01 * ox - nm11 * oy - this.m21 * oz + tm31;
        dest.m32 = -nm02 * ox - nm12 * oy - this.m22 * oz + tm32;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Set this matrix to a transformation composed of a rotation of the specified {@link Quaterniondc} while using <code>(ox, oy, oz)</code> as the rotation origin.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(ox, oy, oz).rotate(quat).translate(-ox, -oy, -oz)</code>
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @param quat
     *          the {@link Quaterniondc}
     * @param ox
     *          the x coordinate of the rotation origin
     * @param oy
     *          the y coordinate of the rotation origin
     * @param oz
     *          the z coordinate of the rotation origin
     * @return this
     */
    public rotationAround(quat: Quaternion, ox: number, oy: number, oz: number): Matrix4 {
        const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
        const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
        const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
        const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
        this.m20 = (dyw + dxz);
        this.m21 = (dyz - dxw);
        this.m22 = (z2 - y2 - x2 + w2);
        this.m23 = (0.0);
        this.m00 = (w2 + x2 - z2 - y2);
        this.m01 = (dxy + dzw);
        this.m02 = (dxz - dyw);
        this.m03 = (0.0);
        this.m10 = (-dzw + dxy);
        this.m11 = (y2 - z2 + w2 - x2);
        this.m12 = (dyz + dxw);
        this.m13 = (0.0);
        this.m30 = (-this.m00 * ox - this.m10 * oy - this.m20 * oz + ox);
        this.m31 = (-this.m01 * ox - this.m11 * oy - this.m21 * oz + oy);
        this.m32 = (-this.m02 * ox - this.m12 * oy - this.m22 * oz + oz);
        this.m33 = (1.0);
        return this;
    }

    /**
     * Pre-multiply a rotation to this matrix by rotating the given amount of radians
     * about the specified <code>(x, y, z)</code> axis and store the result in <code>dest</code>.
     * <p>
     * The axis described by the three components needs to be a unit vector.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>R * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>R * M * v</code>, the
     * rotation will be applied last!
     * <p>
     * In order to set the matrix to a rotation matrix without pre-multiplying the rotation
     * transformation, use {@link #rotation(double, double, double, double) rotation()}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotation(double, double, double, double)
     * 
     * @param ang
     *            the angle in radians
     * @param x
     *            the x component of the axis
     * @param y
     *            the y component of the axis
     * @param z
     *            the z component of the axis
     * @param dest
     *            will hold the result
     * @return dest
     */
    public rotateLocal(ang: number, x: number, y: number, z: number, dest?: Matrix4) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotation(ang, x, y, z);
        return this.rotateLocalGeneric(ang, x, y, z, dest);
    }
    private rotateLocalGeneric(ang: number, x: number, y: number, z: number, dest: Matrix4) {
        if (y === 0.0 && z === 0.0 && Math.abs(x) === 1)
            return this.rotateLocalX(x * ang, dest);
        else if (x === 0.0 && z === 0.0 && Math.abs(y) === 1)
            return this.rotateLocalY(y * ang, dest);
        else if (x === 0.0 && y === 0.0 && Math.abs(z) === 1)
            return this.rotateLocalZ(z * ang, dest);
        return this.rotateLocalGenericInternal(ang, x, y, z, dest);
    }
    private rotateLocalGenericInternal(ang: number, x: number, y: number, z: number, dest: Matrix4) {
        const s = Math.sin(ang);
        const c = Math.cos(ang);
        const C = 1.0 - c;
        const xx = x * x, xy = x * y, xz = x * z;
        const yy = y * y, yz = y * z;
        const zz = z * z;
        const lm00 = xx * C + c;
        const lm01 = xy * C + z * s;
        const lm02 = xz * C - y * s;
        const lm10 = xy * C - z * s;
        const lm11 = yy * C + c;
        const lm12 = yz * C + x * s;
        const lm20 = xz * C + y * s;
        const lm21 = yz * C - x * s;
        const lm22 = zz * C + c;
        return dest.set(
            lm00 * this.m00 + lm10 * this.m01 + lm20 * this.m02,
            lm01 * this.m00 + lm11 * this.m01 + lm21 * this.m02,
            lm02 * this.m00 + lm12 * this.m01 + lm22 * this.m02,
            this.m03,
            lm00 * this.m10 + lm10 * this.m11 + lm20 * this.m12,
            lm01 * this.m10 + lm11 * this.m11 + lm21 * this.m12,
            lm02 * this.m10 + lm12 * this.m11 + lm22 * this.m12,
            this.m13,
            lm00 * this.m20 + lm10 * this.m21 + lm20 * this.m22,
            lm01 * this.m20 + lm11 * this.m21 + lm21 * this.m22,
            lm02 * this.m20 + lm12 * this.m21 + lm22 * this.m22,
            this.m23,
            lm00 * this.m30 + lm10 * this.m31 + lm20 * this.m32,
            lm01 * this.m30 + lm11 * this.m31 + lm21 * this.m32,
            lm02 * this.m30 + lm12 * this.m31 + lm22 * this.m32,
            this.m33,
        );
    }

    /**
     * Pre-multiply the rotation - and possibly scaling - transformation of the given {@link Quaterniondc} to this matrix while using <code>(ox, oy, oz)</code>
     * as the rotation origin.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>Q</code> the rotation matrix obtained from the given quaternion,
     * then the new matrix will be <code>Q * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>Q * M * v</code>,
     * the quaternion rotation will be applied last!
     * <p>
     * This method is equivalent to calling: <code>translateLocal(-ox, -oy, -oz).rotateLocal(quat).translateLocal(ox, oy, oz)</code>
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @param quat
     *          the {@link Quaterniondc}
     * @param ox
     *          the x coordinate of the rotation origin
     * @param oy
     *          the y coordinate of the rotation origin
     * @param oz
     *          the z coordinate of the rotation origin
     * @return this
     */
    public rotateAroundLocal(quat: Quaternion, ox: number, oy: number, oz: number, dest?: Matrix4) {
        dest = dest ?? this;
        const w2 = quat.w * quat.w;
        const x2 = quat.x * quat.x;
        const y2 = quat.y * quat.y;
        const z2 = quat.z * quat.z;
        const zw = quat.z * quat.w;
        const xy = quat.x * quat.y;
        const xz = quat.x * quat.z;
        const yw = quat.y * quat.w;
        const yz = quat.y * quat.z;
        const xw = quat.x * quat.w;
        const lm00 = w2 + x2 - z2 - y2;
        const lm01 = xy + zw + zw + xy;
        const lm02 = xz - yw + xz - yw;
        const lm10 = -zw + xy - zw + xy;
        const lm11 = y2 - z2 + w2 - x2;
        const lm12 = yz + yz + xw + xw;
        const lm20 = yw + xz + xz + yw;
        const lm21 = yz + yz - xw - xw;
        const lm22 = z2 - y2 - x2 + w2;
        const tm00 = this.m00 - ox * this.m03;
        const tm01 = this.m01 - oy * this.m03;
        const tm02 = this.m02 - oz * this.m03;
        const tm10 = this.m10 - ox * this.m13;
        const tm11 = this.m11 - oy * this.m13;
        const tm12 = this.m12 - oz * this.m13;
        const tm20 = this.m20 - ox * this.m23;
        const tm21 = this.m21 - oy * this.m23;
        const tm22 = this.m22 - oz * this.m23;
        const tm30 = this.m30 - ox * this.m33;
        const tm31 = this.m31 - oy * this.m33;
        const tm32 = this.m32 - oz * this.m33;
        dest.m00 = lm00 * tm00 + lm10 * tm01 + lm20 * tm02 + ox * this.m03;
        dest.m01 = lm01 * tm00 + lm11 * tm01 + lm21 * tm02 + oy * this.m03;
        dest.m02 = lm02 * tm00 + lm12 * tm01 + lm22 * tm02 + oz * this.m03;
        dest.m03 = this.m03;
        dest.m10 = lm00 * tm10 + lm10 * tm11 + lm20 * tm12 + ox * this.m13;
        dest.m11 = lm01 * tm10 + lm11 * tm11 + lm21 * tm12 + oy * this.m13;
        dest.m12 = lm02 * tm10 + lm12 * tm11 + lm22 * tm12 + oz * this.m13;
        dest.m13 = this.m13;
        dest.m20 = lm00 * tm20 + lm10 * tm21 + lm20 * tm22 + ox * this.m23;
        dest.m21 = lm01 * tm20 + lm11 * tm21 + lm21 * tm22 + oy * this.m23;
        dest.m22 = lm02 * tm20 + lm12 * tm21 + lm22 * tm22 + oz * this.m23;
        dest.m23 = this.m23;
        dest.m30 = lm00 * tm30 + lm10 * tm31 + lm20 * tm32 + ox * this.m33;
        dest.m31 = lm01 * tm30 + lm11 * tm31 + lm21 * tm32 + oy * this.m33;
        dest.m32 = lm02 * tm30 + lm12 * tm31 + lm22 * tm32 + oz * this.m33;
        dest.m33 = this.m33;
        return dest;
    }

    /**
     * Apply a translation to this matrix by translating by the given number of
     * units in x, y and z and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>T</code> the translation
     * matrix, then the new matrix will be <code>M * T</code>. So when
     * transforming a vector <code>v</code> with the new matrix by using
     * <code>M * T * v</code>, the translation will be applied first!
     * <p>
     * In order to set the matrix to a translation transformation without post-multiplying
     * it, use {@link #translation(Vector3)}.
     * 
     * @see #translation(Vector3)
     * 
     * @param offset
     *          the number of units in x, y and z by which to translate
     * @param dest
     *          will hold the result
     * @return dest
     */
    public translate(offset: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply a translation to this matrix by translating by the given number of
     * units in x, y and z and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>T</code> the translation
     * matrix, then the new matrix will be <code>M * T</code>. So when
     * transforming a vector <code>v</code> with the new matrix by using
     * <code>M * T * v</code>, the translation will be applied first!
     * <p>
     * In order to set the matrix to a translation transformation without post-multiplying
     * it, use {@link #translation(double, double, double)}.
     * 
     * @see #translation(double, double, double)
     * 
     * @param x
     *          the offset to translate in x
     * @param y
     *          the offset to translate in y
     * @param z
     *          the offset to translate in z
     * @param dest
     *          will hold the result
     * @return dest
     */
    public translate(x: number, y: number, z: number, dest: Matrix4): Matrix4;
    public translate(x: number | Vector3, y?: number | Matrix4, z?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.translation(x, y as number, z);
        return this.translateGeneric(x, y as number, z, dest);
    }
    private translateGeneric(x: number, y: number, z: number, dest?: Matrix4) {
        dest = dest ?? this;
        dest.m30 = this.m00 * x * this.m10 * y + this.m20 * z + this.m30;
        dest.m31 = this.m01 * x * this.m11 * y + this.m21 * z + this.m31;
        dest.m32 = this.m02 * x * this.m12 * y + this.m22 * z + this.m32;
        dest.m33 = this.m03 * x * this.m13 * y + this.m23 * z + this.m33;
        if (dest === this)
            return;
        dest.m00 = this.m00;
        dest.m01 = this.m01;
        dest.m02 = this.m02;
        dest.m03 = this.m03;
        dest.m10 = this.m10;
        dest.m11 = this.m11;
        dest.m12 = this.m12;
        dest.m13 = this.m13;
        dest.m20 = this.m20;
        dest.m21 = this.m21;
        dest.m22 = this.m22;
        dest.m23 = this.m23;
        return dest;
    }

    /**
     * Pre-multiply a translation to this matrix by translating by the given number of
     * units in x, y and z and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>T</code> the translation
     * matrix, then the new matrix will be <code>T * M</code>. So when
     * transforming a vector <code>v</code> with the new matrix by using
     * <code>T * M * v</code>, the translation will be applied last!
     * <p>
     * In order to set the matrix to a translation transformation without pre-multiplying
     * it, use {@link #translation(Vector3dc)}.
     * 
     * @see #translation(Vector3)
     * 
     * @param offset
     *          the number of units in x, y and z by which to translate
     * @param dest
     *          will hold the result
     * @return dest
     */
    public translateLocal(offset: Vector3, dest: Matrix4): Matrix4;

    /**
     * Pre-multiply a translation to this matrix by translating by the given number of
     * units in x, y and z and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>T</code> the translation
     * matrix, then the new matrix will be <code>T * M</code>. So when
     * transforming a vector <code>v</code> with the new matrix by using
     * <code>T * M * v</code>, the translation will be applied last!
     * <p>
     * In order to set the matrix to a translation transformation without pre-multiplying
     * it, use {@link #translation(double, double, double)}.
     * 
     * @see #translation(double, double, double)
     * 
     * @param x
     *          the offset to translate in x
     * @param y
     *          the offset to translate in y
     * @param z
     *          the offset to translate in z
     * @param dest
     *          will hold the result
     * @return dest
     */
    public translateLocal(x: number, y: number, z: number, dest: Matrix4): Matrix4;
    public translateLocal(x: number | Vector3, y?: number | Matrix4, z?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (y instanceof Matrix4 ? y : this);
        if (x instanceof Vector3) {
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
        }

        if (this.PROPERTY_IDENTITY)
            return dest.translation(x, y, z);
        return this.translateLocalGeneric(x, y, z, dest);
    }
    private translateLocalGeneric(x: number, y: number, z: number, dest: Matrix4) {
        return dest.set(
            this.m00 + x * this.m03,
            this.m01 + y * this.m03,
            this.m02 + z * this.m03,
            this.m13,
            this.m10 + x * this.m13,
            this.m11 + y * this.m13,
            this.m12 + z * this.m13,
            this.m23,
            this.m20 + x * this.m23,
            this.m21 + y * this.m23,
            this.m22 + z * this.m23,
            this.m03,
            this.m30 + x * this.m33,
            this.m31 + y * this.m33,
            this.m32 + z * this.m33,
            this.m33,
        );
    }

    /**
     * Pre-multiply a rotation around the X axis to this matrix by rotating the given amount of radians
     * about the X axis and store the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>R * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>R * M * v</code>, the
     * rotation will be applied last!
     * <p>
     * In order to set the matrix to a rotation matrix without pre-multiplying the rotation
     * transformation, use {@link #rotationX(double) rotationX()}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotationX(double)
     * 
     * @param ang
     *            the angle in radians to rotate about the X axis
     * @param dest
     *            will hold the result
     * @return dest
     */
    public rotateLocalX(ang: number, dest?: Matrix4) {
        dest = dest ?? this;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(
            this.m00,
            cos * this.m01 - sin * this.m02,
            sin * this.m01 + cos * this.m02,
            this.m03,
            this.m10,
            cos * this.m11 - sin * this.m12,
            sin * this.m11 + cos * this.m12,
            this.m13,
            this.m20,
            cos * this.m21 - sin * this.m22,
            sin * this.m21 + cos * this.m22,
            this.m23,
            this.m30,
            cos * this.m31 - sin * this.m32,
            sin * this.m31 + cos * this.m32,
            this.m33,
        );
    }

    /**
     * Pre-multiply a rotation around the Y axis to this matrix by rotating the given amount of radians
     * about the Y axis and store the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>R * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>R * M * v</code>, the
     * rotation will be applied last!
     * <p>
     * In order to set the matrix to a rotation matrix without pre-multiplying the rotation
     * transformation, use {@link #rotationY(double) rotationY()}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotationY(double)
     * 
     * @param ang
     *            the angle in radians to rotate about the Y axis
     * @param dest
     *            will hold the result
     * @return dest
     */
    public rotateLocalY(ang: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(
            cos * this.m00 + sin * this.m02,
            this.m01,
            cos * this.m02 - sin * this.m00,
            this.m03,
            cos * this.m10 + sin * this.m12,
            this.m11,
            cos * this.m12 - sin * this.m10,
            this.m13,
            cos * this.m20 + sin * this.m22,
            this.m21,
            cos * this.m22 - sin * this.m20,
            this.m23,
            cos * this.m30 + sin * this.m32,
            this.m31,
            cos * this.m32 - sin * this.m30,
            this.m33,
        )
    }

    /**
     * Pre-multiply a rotation around the Z axis to this matrix by rotating the given amount of radians
     * about the Z axis and store the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>R * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>R * M * v</code>, the
     * rotation will be applied last!
     * <p>
     * In order to set the matrix to a rotation matrix without pre-multiplying the rotation
     * transformation, use {@link #rotationZ(double) rotationZ()}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotationZ(double)
     * 
     * @param ang
     *            the angle in radians to rotate about the Z axis
     * @param dest
     *            will hold the result
     * @return dest
     */
    public rotateLocalZ(ang: number, dest?: Matrix4) {
        dest = dest ?? this;
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return dest.set(
            sin * this.m00 + cos * this.m01,
            cos * this.m00 - sin * this.m01,
            this.m02,
            this.m03,
            cos * this.m10 - sin * this.m11,
            sin * this.m10 + cos * this.m11,
            this.m12,
            this.m13,
            cos * this.m20 - sin * this.m21,
            sin * this.m20 + cos * this.m21,
            this.m22,
            this.m23,
            cos * this.m30 - sin * this.m31,
            sin * this.m30 + cos * this.m31,
            this.m32,
            this.m33,
        );
    }

    /**
     * Apply rotation about the X axis to this matrix by rotating the given amount of radians.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations">http://en.wikipedia.org</a>
     * 
     * @param ang
     *            the angle in radians
     * @return this
     */
    public rotateX(ang: number, dest?: Matrix4) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationX(ang);
        else if (this.PROPERTY_TRANSLATION) {
            const x = this.m30, y = this.m31, z = this.m32;
            return dest.rotationX(ang).setTranslation(x, y, z);
        }
        return this.rotateXInternal(ang, dest);
    }
    private rotateXInternal(ang: number, dest: Matrix4) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        // set non-dependent values directly
        return dest.set(
            this.m00,
            this.m01,
            this.m02,
            this.m03,
            this.m10 * cos + this.m20 * sin,
            this.m11 * cos + this.m21 * sin,
            this.m12 * cos + this.m22 * sin,
            this.m13 * cos + this.m23 * sin,
            this.m20 * cos - this.m10 * sin,
            this.m21 * cos - this.m11 * sin,
            this.m22 * cos - this.m12 * sin,
            this.m23 * cos - this.m13 * sin,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        );
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation about the Y axis to this matrix by rotating the given amount of radians.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations">http://en.wikipedia.org</a>
     * 
     * @param ang
     *            the angle in radians
     * @return this
     */
    public rotateY(ang: number, dest?: Matrix4) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationY(ang);
        else if (this.PROPERTY_TRANSLATION) {
            return dest.rotationY(ang).setTranslation(this.m30, this.m31, this.m32);
        }
        return this.rotateYInternal(ang, dest);
    }
    private rotateYInternal(ang: number, dest: Matrix4) {
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        // set non-dependent values directly
        return dest.set(
            this.m00 * cos - this.m20 * sin,
            this.m01 * cos - this.m21 * sin,
            this.m02 * cos - this.m22 * sin,
            this.m03 * cos - this.m23 * sin,
            this.m10,
            this.m11,
            this.m12,
            this.m13,
            this.m00 * sin + this.m20 * cos,
            this.m01 * sin + this.m21 * cos,
            this.m02 * sin + this.m22 * cos,
            this.m03 * sin + this.m23 * cos,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        )
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation about the Z axis to this matrix by rotating the given amount of radians.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations">http://en.wikipedia.org</a>
     * 
     * @param ang
     *            the angle in radians
     * @return this
     */
    public rotateZ(ang: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationZ(ang);
        else if (this.PROPERTY_TRANSLATION) {
            return dest.rotationZ(ang).setTranslation(this.m30, this.m31, this.m32);
        }
        // rotateZInternal
        const sin = Math.sin(ang);
        const cos = Math.cos(ang);
        return this.rotateTowardsXY(sin, cos, dest);
    }

    /**
     * Apply rotation about the Z axis to align the local <code>+X</code> towards <code>(dirX, dirY)</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * The vector <code>(dirX, dirY)</code> must be a unit vector.
     * 
     * @param dirX
     *            the x component of the normalized direction
     * @param dirY
     *            the y component of the normalized direction
     * @return this
     */
    public rotateTowardsXY(dirX: number, dirY: number, dest?: Matrix4) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationTowardsXY(dirX, dirY);
        return dest.set(
            this.m00 * dirY + this.m10 * dirX,
            this.m01 * dirY + this.m11 * dirX,
            this.m02 * dirY + this.m12 * dirX,
            this.m03 * dirY + this.m13 * dirX,
            this.m10 * dirY - this.m00 * dirX,
            this.m11 * dirY - this.m01 * dirX,
            this.m12 * dirY - this.m02 * dirX,
            this.m13 * dirY - this.m03 * dirX,
            this.m20,
            this.m21,
            this.m22,
            this.m23,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        )
        //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation of <code>angles.x</code> radians about the X axis, followed by a rotation of <code>angles.y</code> radians about the Y axis and
     * followed by a rotation of <code>angles.z</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateX(angles.x).rotateY(angles.y).rotateZ(angles.z)</code>
     * 
     * @param angles
     *            the Euler angles
     * @return this
     */
    public rotateXYZ(angles: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply rotation of <code>angleX</code> radians about the X axis, followed by a rotation of <code>angleY</code> radians about the Y axis and
     * followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateX(angleX).rotateY(angleY).rotateZ(angleZ)</code>
     * 
     * @param angleX
     *            the angle to rotate about X
     * @param angleY
     *            the angle to rotate about Y
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public rotateXYZ(angleX: number, angleY: number, angleZ: number, dest?: Matrix4): Matrix4;
    public rotateXYZ(angleX: number | Vector3, angleY?: number | Matrix4, angleZ?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (angleX instanceof Vector3) {
            angleZ = angleX.z, angleY = angleX.y, angleX = angleX.x;
        } else {
            angleY = angleY as number;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotationXYZ(angleX, angleY, angleZ);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationXYZ(angleX, angleY, angleZ).setTranslation(this.m30, this.m31, this.m32);
        else if (this.PROPERTY_AFFINE)
            return dest.rotateAffineXYZ(angleX, angleY, angleZ);
        return this.rotateXYZInternal(angleX, angleY, angleZ, dest);
    }
    private rotateXYZInternal(angleX: number, angleY: number, angleZ: number, dest: Matrix4): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);

        // rotateX
        const nm10 = this.m10 * cosX + this.m20 * sinX;
        const nm11 = this.m11 * cosX + this.m21 * sinX;
        const nm12 = this.m12 * cosX + this.m22 * sinX;
        const nm13 = this.m13 * cosX + this.m23 * sinX;
        const nm20 = this.m20 * cosX - this.m10 * sinX;
        const nm21 = this.m21 * cosX - this.m11 * sinX;
        const nm22 = this.m22 * cosX - this.m12 * sinX;
        const nm23 = this.m23 * cosX - this.m13 * sinX;
        // rotateY
        const nm00 = this.m00 * cosY - nm20 * sinY;
        const nm01 = this.m01 * cosY - nm21 * sinY;
        const nm02 = this.m02 * cosY - nm22 * sinY;
        const nm03 = this.m03 * cosY - nm23 * sinY;

        return dest.set(
            nm00 * cosZ + nm10 * sinZ,
            nm01 * cosZ + nm11 * sinZ,
            nm02 * cosZ + nm12 * sinZ,
            nm03 * cosZ + nm13 * sinZ,
            nm10 * cosZ - nm00 * sinZ,
            nm11 * cosZ - nm01 * sinZ,
            nm12 * cosZ - nm02 * sinZ,
            nm13 * cosZ - nm03 * sinZ,
            this.m00 * sinY + nm20 * cosY,
            this.m01 * sinY + nm21 * cosY,
            this.m02 * sinY + nm22 * cosY,
            this.m03 * sinY + nm23 * cosY,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        )
        // _properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation of <code>angleX</code> radians about the X axis, followed by a rotation of <code>angleY</code> radians about the Y axis and
     * followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method assumes that <code>this</code> matrix represents an {@link #isAffine() affine} transformation (i.e. its last row is equal to <code>(0, 0, 0, 1)</code>)
     * and can be used to speed up matrix multiplication if the matrix only represents affine transformations, such as translation, rotation, scaling and shearing (in any combination).
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateX(angleX).rotateY(angleY).rotateZ(angleZ)</code>
     * 
     * @param angleX
     *            the angle to rotate about X
     * @param angleY
     *            the angle to rotate about Y
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public rotateAffineXYZ(angleX: number, angleY: number, angleZ: number, dest?: Matrix4) {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.rotationXYZ(angleX, angleY, angleZ);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationXYZ(angleX, angleY, angleZ).setTranslation(this.m30, this.m31, this.m32);
        return this.rotateAffineXYZInternal(angleX, angleY, angleZ, dest);
    }
    private rotateAffineXYZInternal(angleX: number, angleY: number, angleZ: number, dest: Matrix4) {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        // rotateX
        const nm10 = this.m10 * cosX + this.m20 * sinX;
        const nm11 = this.m11 * cosX + this.m21 * sinX;
        const nm12 = this.m12 * cosX + this.m22 * sinX;
        const nm20 = this.m20 * cosX - this.m10 * sinX;
        const nm21 = this.m21 * cosX - this.m11 * sinX;
        const nm22 = this.m22 * cosX - this.m12 * sinX;
        // rotateY
        const nm00 = this.m00 * cosY - nm20 * sinY;
        const nm01 = this.m01 * cosY - nm21 * sinY;
        const nm02 = this.m02 * cosY - nm22 * sinY;
        return dest.set(
            nm00 * cosZ + nm10 * sinZ,
            nm01 * cosZ + nm11 * sinZ,
            nm02 * cosZ + nm12 * sinZ,
            0.0,
            nm10 * cosZ - nm00 * sinZ,
            nm11 * cosZ - nm01 * sinZ,
            nm12 * cosZ - nm02 * sinZ,
            0.0,
            this.m00 * sinY + nm20 * cosY,
            this.m01 * sinY + nm21 * cosY,
            this.m02 * sinY + nm22 * cosY,
            0.0,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        )
        // _properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation of <code>angles.z</code> radians about the Z axis, followed by a rotation of <code>angles.y</code> radians about the Y axis and
     * followed by a rotation of <code>angles.x</code> radians about the X axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateZ(angles.z).rotateY(angles.y).rotateX(angles.x)</code>
     * 
     * @param angles
     *            the Euler angles
     * @return this
     */
    public rotateZYX(angles: Vector3, dest?: Matrix4): Matrix4;
    /**
     * Apply rotation of <code>angleZ</code> radians about the Z axis, followed by a rotation of <code>angleY</code> radians about the Y axis and
     * followed by a rotation of <code>angleX</code> radians about the X axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateZ(angleZ).rotateY(angleY).rotateX(angleX)</code>
     * 
     * @param angleZ
     *            the angle to rotate about Z
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @return this
     */
    public rotateZYX(angleZ: number, angleY: number, angleX: number, dest?: Matrix4): Matrix4;
    public rotateZYX(angleZ: number | Vector3, angleY?: number | Matrix4, angleX?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (angleY instanceof Matrix4 ? angleY : this);
        if (angleZ instanceof Vector3) {
            angleX = angleZ.x, angleY = angleZ.y, angleZ = angleZ.z;
        } else {
            angleY = angleY as number;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotationZYX(angleZ, angleY, angleX);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationZYX(angleZ, angleY, angleX).setTranslation(this.m30, this.m31, this.m32);
        else if (this.PROPERTY_AFFINE)
            return dest.rotateAffineZYX(angleZ, angleY, angleX);
        return this.rotateZYXInternal(angleZ, angleY, angleX, dest);
    }
    private rotateZYXInternal(angleZ: number, angleY: number, angleX: number, dest: Matrix4): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        // rotateZ
        const nm00 = this.m00 * cosZ + this.m10 * sinZ;
        const nm01 = this.m01 * cosZ + this.m11 * sinZ;
        const nm02 = this.m02 * cosZ + this.m12 * sinZ;
        const nm03 = this.m03 * cosZ + this.m13 * sinZ;
        const nm10 = this.m10 * cosZ - this.m00 * sinZ;
        const nm11 = this.m11 * cosZ - this.m01 * sinZ;
        const nm12 = this.m12 * cosZ - this.m02 * sinZ;
        const nm13 = this.m13 * cosZ - this.m03 * sinZ;
        // rotateY
        const nm20 = nm00 * sinY + this.m20 * cosY;
        const nm21 = nm01 * sinY + this.m21 * cosY;
        const nm22 = nm02 * sinY + this.m22 * cosY;
        const nm23 = nm03 * sinY + this.m23 * cosY;

        return dest.set(
            nm00 * cosY - this.m20 * sinY,
            nm01 * cosY - this.m21 * sinY,
            nm02 * cosY - this.m22 * sinY,
            nm03 * cosY - this.m23 * sinY,
            nm10 * cosX + nm20 * sinX,
            nm11 * cosX + nm21 * sinX,
            nm12 * cosX + nm22 * sinX,
            nm13 * cosX + nm23 * sinX,
            nm20 * cosX - nm10 * sinX,
            nm21 * cosX - nm11 * sinX,
            nm22 * cosX - nm12 * sinX,
            nm23 * cosX - nm13 * sinX,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        )
        //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation of <code>angleZ</code> radians about the Z axis, followed by a rotation of <code>angleY</code> radians about the Y axis and
     * followed by a rotation of <code>angleX</code> radians about the X axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method assumes that <code>this</code> matrix represents an {@link #isAffine() affine} transformation (i.e. its last row is equal to <code>(0, 0, 0, 1)</code>)
     * and can be used to speed up matrix multiplication if the matrix only represents affine transformations, such as translation, rotation, scaling and shearing (in any combination).
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * 
     * @param angleZ
     *            the angle to rotate about Z
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @return this
     */
    public rotateAffineZYX(angleZ: number, angleY: number, angleX: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        // rotateZ
        const nm00 = this.m00 * cosZ + this.m10 * sinZ;
        const nm01 = this.m01 * cosZ + this.m11 * sinZ;
        const nm02 = this.m02 * cosZ + this.m12 * sinZ;
        const nm10 = this.m10 * cosZ - this.m00 * sinZ;
        const nm11 = this.m11 * cosZ - this.m01 * sinZ;
        const nm12 = this.m12 * cosZ - this.m02 * sinZ;
        // rotateY
        const nm20 = nm00 * sinY + this.m20 * cosY;
        const nm21 = nm01 * sinY + this.m21 * cosY;
        const nm22 = nm02 * sinY + this.m22 * cosY;

        return dest.set(
            nm00 * cosY - this.m20 * sinY,
            nm01 * cosY - this.m21 * sinY,
            nm02 * cosY - this.m22 * sinY,
            0.0,
            nm10 * cosX + nm20 * sinX,
            nm11 * cosX + nm21 * sinX,
            nm12 * cosX + nm22 * sinX,
            0.0,
            nm20 * cosX - nm10 * sinX,
            nm21 * cosX - nm11 * sinX,
            nm22 * cosX - nm12 * sinX,
            0.0,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        );
        //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation of <code>angles.y</code> radians about the Y axis, followed by a rotation of <code>angles.x</code> radians about the X axis and
     * followed by a rotation of <code>angles.z</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateY(angles.y).rotateX(angles.x).rotateZ(angles.z)</code>
     * 
     * @param angles
     *            the Euler angles
     * @return this
     */
    public rotateYXZ(angles: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply rotation of <code>angleY</code> radians about the Y axis, followed by a rotation of <code>angleX</code> radians about the X axis and
     * followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * <p>
     * This method is equivalent to calling: <code>rotateY(angleY).rotateX(angleX).rotateZ(angleZ)</code>
     * 
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public rotateYXZ(angleY: number, angleX: number, angleZ: number, dest?: Matrix4): Matrix4;
    public rotateYXZ(angleY: number | Vector3, angleX?: number | Matrix4, angleZ?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (angleX instanceof Matrix4 ? angleX : this);
        if (angleY instanceof Vector3) {
            angleZ = angleY.z, angleX = angleY.x, angleY = angleY.y;
        } else {
            angleX = angleX as number;
        }
        if (this.PROPERTY_IDENTITY)
            return dest.rotationYXZ(angleY, angleX, angleZ);
        else if (this.PROPERTY_TRANSLATION)
            return dest.rotationYXZ(angleY, angleX, angleZ).setTranslation(this.m30, this.m31, this.m32);
        else if (this.PROPERTY_AFFINE)
            return dest.rotateAffineYXZ(angleY, angleX, angleZ);
        return this.rotateYXZInternal(angleY, angleX, angleZ, dest);
    }
    private rotateYXZInternal(angleY: number, angleX: number, angleZ: number, dest: Matrix4): Matrix4 {
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        // rotateY
        const nm20 = this.m00 * sinY + this.m20 * cosY;
        const nm21 = this.m01 * sinY + this.m21 * cosY;
        const nm22 = this.m02 * sinY + this.m22 * cosY;
        const nm23 = this.m03 * sinY + this.m23 * cosY;
        const nm00 = this.m00 * cosY - this.m20 * sinY;
        const nm01 = this.m01 * cosY - this.m21 * sinY;
        const nm02 = this.m02 * cosY - this.m22 * sinY;
        const nm03 = this.m03 * cosY - this.m23 * sinY;
        // rotateX
        const nm10 = this.m10 * cosX + nm20 * sinX;
        const nm11 = this.m11 * cosX + nm21 * sinX;
        const nm12 = this.m12 * cosX + nm22 * sinX;
        const nm13 = this.m13 * cosX + nm23 * sinX;
        return dest.set(
            nm00 * cosZ + nm10 * sinZ,
            nm01 * cosZ + nm11 * sinZ,
            nm02 * cosZ + nm12 * sinZ,
            nm03 * cosZ + nm13 * sinZ,
            nm10 * cosZ - nm00 * sinZ,
            nm11 * cosZ - nm01 * sinZ,
            nm12 * cosZ - nm02 * sinZ,
            nm13 * cosZ - nm03 * sinZ,
            nm20 * cosX - this.m10 * sinX,
            nm21 * cosX - this.m11 * sinX,
            nm22 * cosX - this.m12 * sinX,
            nm23 * cosX - this.m13 * sinX,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        );
        //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply rotation of <code>angleY</code> radians about the Y axis, followed by a rotation of <code>angleX</code> radians about the X axis and
     * followed by a rotation of <code>angleZ</code> radians about the Z axis.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method assumes that <code>this</code> matrix represents an {@link #isAffine() affine} transformation (i.e. its last row is equal to <code>(0, 0, 0, 1)</code>)
     * and can be used to speed up matrix multiplication if the matrix only represents affine transformations, such as translation, rotation, scaling and shearing (in any combination).
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the rotation matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * rotation will be applied first!
     * 
     * @param angleY
     *            the angle to rotate about Y
     * @param angleX
     *            the angle to rotate about X
     * @param angleZ
     *            the angle to rotate about Z
     * @return this
     */
    public rotateAffineYXZ(angleY: number, angleX: number, angleZ: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const sinX = Math.sin(angleX);
        const cosX = Math.cos(angleX);
        const sinY = Math.sin(angleY);
        const cosY = Math.cos(angleY);
        const sinZ = Math.sin(angleZ);
        const cosZ = Math.cos(angleZ);
        // rotateY
        const nm20 = this.m00 * sinY + this.m20 * cosY;
        const nm21 = this.m01 * sinY + this.m21 * cosY;
        const nm22 = this.m02 * sinY + this.m22 * cosY;
        const nm00 = this.m00 * cosY - this.m20 * sinY;
        const nm01 = this.m01 * cosY - this.m21 * sinY;
        const nm02 = this.m02 * cosY - this.m22 * sinY;
        // rotateX
        const nm10 = this.m10 * cosX + nm20 * sinX;
        const nm11 = this.m11 * cosX + nm21 * sinX;
        const nm12 = this.m12 * cosX + nm22 * sinX;
        return dest.set(
            nm00 * cosZ + nm10 * sinZ,
            nm01 * cosZ + nm11 * sinZ,
            nm02 * cosZ + nm12 * sinZ,
            0.0,
            nm10 * cosZ - nm00 * sinZ,
            nm11 * cosZ - nm01 * sinZ,
            nm12 * cosZ - nm02 * sinZ,
            0.0,
            nm20 * cosX - this.m10 * sinX,
            nm21 * cosX - this.m11 * sinX,
            nm22 * cosX - this.m12 * sinX,
            0.0,
            this.m30,
            this.m31,
            this.m32,
            this.m33,
        )
        //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Set <code>this</code> matrix to <code>T * R * S</code>, where <code>T</code> is a translation by the given <code>(tx, ty, tz)</code>,
     * <code>R</code> is a rotation transformation specified by the quaternion <code>(qx, qy, qz, qw)</code>, and <code>S</code> is a scaling transformation
     * which scales the three axes x, y and z by <code>(sx, sy, sz)</code>.
     * <p>
     * When transforming a vector by the resulting matrix the scaling transformation will be applied first, then the rotation and
     * at last the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(tx, ty, tz).rotate(quat).scale(sx, sy, sz)</code>
     * 
     * @see #translation(double, double, double)
     * @see #rotate(Quaterniondc)
     * @see #scale(double, double, double)
     * 
     * @param tx
     *          the number of units by which to translate the x-component
     * @param ty
     *          the number of units by which to translate the y-component
     * @param tz
     *          the number of units by which to translate the z-component
     * @param qx
     *          the x-coordinate of the vector part of the quaternion
     * @param qy
     *          the y-coordinate of the vector part of the quaternion
     * @param qz
     *          the z-coordinate of the vector part of the quaternion
     * @param qw
     *          the scalar part of the quaternion
     * @param sx
     *          the scaling factor for the x-axis
     * @param sy
     *          the scaling factor for the y-axis
     * @param sz
     *          the scaling factor for the z-axis
     * @return this
     */
    public translationRotateScale(
        tx: number, ty: number, tz: number,
        qx: number, qy: number, qz: number, qw: number,
        sx: number, sy: number, sz: number): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>T * R * S</code>, where <code>T</code> is the given <code>translation</code>,
     * <code>R</code> is a rotation transformation specified by the given quaternion, and <code>S</code> is a scaling transformation
     * which scales the axes by <code>scale</code>.
     * <p>
     * When transforming a vector by the resulting matrix the scaling transformation will be applied first, then the rotation and
     * at last the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(translation).rotate(quat).scale(scale)</code>
     * 
     * @see #translation(Vector3dc)
     * @see #rotate(Quaterniondc)
     * @see #scale(Vector3dc)
     * 
     * @param translation
     *          the translation
     * @param quat
     *          the quaternion representing a rotation
     * @param scale
     *          the scaling factors
     * @return this
     */
    public translationRotateScale(translation: Vector3, quat: Quaternion, scale: Vector3): Matrix4;
    public translationRotateScale(
        tx: number, ty: number, tz: number,
        qx: number, qy: number, qz: number, qw: number,
        sx: number, sy: number, sz: number): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>T * R * S</code>, where <code>T</code> is a translation by the given <code>(tx, ty, tz)</code>,
     * <code>R</code> is a rotation transformation specified by the quaternion <code>(qx, qy, qz, qw)</code>, and <code>S</code> is a scaling transformation
     * which scales all three axes by <code>scale</code>.
     * <p>
     * When transforming a vector by the resulting matrix the scaling transformation will be applied first, then the rotation and
     * at last the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(tx, ty, tz).rotate(quat).scale(scale)</code>
     * 
     * @see #translation(double, double, double)
     * @see #rotate(Quaterniondc)
     * @see #scale(double)
     * 
     * @param tx
     *          the number of units by which to translate the x-component
     * @param ty
     *          the number of units by which to translate the y-component
     * @param tz
     *          the number of units by which to translate the z-component
     * @param qx
     *          the x-coordinate of the vector part of the quaternion
     * @param qy
     *          the y-coordinate of the vector part of the quaternion
     * @param qz
     *          the z-coordinate of the vector part of the quaternion
     * @param qw
     *          the scalar part of the quaternion
     * @param scale
     *          the scaling factor for all three axes
     * @return this
     */
    public translationRotateScale(tx: number, ty: number, tz: number,
        qx: number, qy: number, qz: number, qw: number,
        scale: number): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>T * R * S</code>, where <code>T</code> is the given <code>translation</code>,
     * <code>R</code> is a rotation transformation specified by the given quaternion, and <code>S</code> is a scaling transformation
     * which scales all three axes by <code>scale</code>.
     * <p>
     * When transforming a vector by the resulting matrix the scaling transformation will be applied first, then the rotation and
     * at last the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(translation).rotate(quat).scale(scale)</code>
     * 
     * @see #translation(Vector3dc)
     * @see #rotate(Quaterniondc)
     * @see #scale(double)
     * 
     * @param translation
     *          the translation
     * @param quat
     *          the quaternion representing a rotation
     * @param scale
     *          the scaling factors
     * @return this
     */
    public translationRotateScale(translation: Vector3, quat: Quaternion, scale: number): Matrix4;
    public translationRotateScale(
        tx: number | Vector3, ty: number | Quaternion, tz: number | Vector3,
        qx?: number, qy?: number, qz?: number, qw?: number,
        sx?: number, sy?: number, sz?: number): Matrix4 {
        if (tz instanceof Vector3) {
            sz = tz.z, sy = tz.y, sx = tz.x;
            tz = 0;
        }
        if (ty instanceof Quaternion) {
            qw = ty.w, qz = ty.z, qy = ty.y, qx = ty.x;
            ty = 0;
        }
        if (tx instanceof Vector3) {
            tz = tx.z, ty = tx.y, tx = tx.x;

            if (typeof tz === "number") {
                sz = tz, sy = tz, sx = tz;
            }
        } else if (sy === undefined) {
            sz = sx, sy = sx;
        }

        const dqx = qx + qx, dqy = qy + qy, dqz = qz + qz;
        const q00 = dqx * qx;
        const q11 = dqy * qy;
        const q22 = dqz * qz;
        const q01 = dqx * qy;
        const q02 = dqx * qz;
        const q03 = dqx * qw;
        const q12 = dqy * qz;
        const q13 = dqy * qw;
        const q23 = dqz * qw;
        this.m00 = sx - (q11 + q22) * sx;
        this.m01 = (q01 + q23) * sx;
        this.m02 = (q02 - q13) * sx;
        this.m03 = 0.0;
        this.m10 = (q01 - q23) * sy;
        this.m11 = sy - (q22 + q00) * sy;
        this.m12 = (q12 + q03) * sy;
        this.m13 = 0.0;
        this.m20 = (q02 + q13) * sz;
        this.m21 = (q12 - q03) * sz;
        this.m22 = sz - (q11 + q00) * sz;
        this.m23 = 0.0;
        this.m30 = tx;
        this.m31 = ty;
        this.m32 = tz;
        this.m33 = 1.0;
        return this;
    }

    /**
     * Set <code>this</code> matrix to <code>(T * R * S)<sup>-1</sup></code>, where <code>T</code> is a translation by the given <code>(tx, ty, tz)</code>,
     * <code>R</code> is a rotation transformation specified by the quaternion <code>(qx, qy, qz, qw)</code>, and <code>S</code> is a scaling transformation
     * which scales the three axes x, y and z by <code>(sx, sy, sz)</code>.
     * <p>
     * This method is equivalent to calling: <code>translationRotateScale(...).invert()</code>
     * 
     * @see #translationRotateScale(double, double, double, double, double, double, double, double, double, double)
     * @see #invert()
     * 
     * @param tx
     *          the number of units by which to translate the x-component
     * @param ty
     *          the number of units by which to translate the y-component
     * @param tz
     *          the number of units by which to translate the z-component
     * @param qx
     *          the x-coordinate of the vector part of the quaternion
     * @param qy
     *          the y-coordinate of the vector part of the quaternion
     * @param qz
     *          the z-coordinate of the vector part of the quaternion
     * @param qw
     *          the scalar part of the quaternion
     * @param sx
     *          the scaling factor for the x-axis
     * @param sy
     *          the scaling factor for the y-axis
     * @param sz
     *          the scaling factor for the z-axis
     * @return this
     */
    public translationRotateScaleInvert(tx: number, ty: number, tz: number,
        qx: number, qy: number, qz: number, qw: number,
        sx: number, sy: number, sz: number): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>(T * R * S)<sup>-1</sup></code>, where <code>T</code> is the given <code>translation</code>,
     * <code>R</code> is a rotation transformation specified by the given quaternion, and <code>S</code> is a scaling transformation
     * which scales the axes by <code>scale</code>.
     * <p>
     * This method is equivalent to calling: <code>translationRotateScale(...).invert()</code>
     * 
     * @see #translationRotateScale(Vector3dc, Quaterniondc, Vector3dc)
     * @see #invert()
     * 
     * @param translation
     *          the translation
     * @param quat
     *          the quaternion representing a rotation
     * @param scale
     *          the scaling factors
     * @return this
     */
    public translationRotateScaleInvert(translation: Vector3, quat: Quaternion, scale: Vector3): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>(T * R * S)<sup>-1</sup></code>, where <code>T</code> is the given <code>translation</code>,
     * <code>R</code> is a rotation transformation specified by the given quaternion, and <code>S</code> is a scaling transformation
     * which scales all three axes by <code>scale</code>.
     * <p>
     * This method is equivalent to calling: <code>translationRotateScale(...).invert()</code>
     * 
     * @see #translationRotateScale(Vector3dc, Quaterniondc, double)
     * @see #invert()
     * 
     * @param translation
     *          the translation
     * @param quat
     *          the quaternion representing a rotation
     * @param scale
     *          the scaling factors
     * @return this
     */
    public translationRotateScaleInvert(translation: Vector3, quat: Quaternion, scale: number): Matrix4;
    public translationRotateScaleInvert(
        tx: number | Vector3, ty: number | Quaternion, tz: number | Vector3,
        qx?: number, qy?: number, qz?: number, qw?: number,
        sx?: number, sy?: number, sz?: number): Matrix4 {
        if (tz instanceof Vector3) {
            sz = tz.z, sy = tz.y, sx = tz.x;
            tz = 0;
        }
        if (ty instanceof Quaternion) {
            qw = ty.w, qz = ty.z, qy = ty.y, qx = ty.x;
            ty = 0;
        }
        if (tx instanceof Vector3) {
            tz = tx.z, ty = tx.y, tx = tx.x;

            if (typeof tz === "number") {
                sz = tz, sy = tz, sx = tz;
            }
        } else if (sy === undefined) {
            sz = sx, sy = sx;
        }
        if (Math.abs(sx) === 1 && Math.abs(sy) === 1 && Math.abs(sz) === 1)
            return this.translationRotateScale(tx, ty, tz, qx, qy, qz, qw, sx, sy, sz).invertOrthonormal(this);

        const nqx = -qx, nqy = -qy, nqz = -qz;
        const dqx = nqx + nqx;
        const dqy = nqy + nqy;
        const dqz = nqz + nqz;
        const q00 = dqx * nqx;
        const q11 = dqy * nqy;
        const q22 = dqz * nqz;
        const q01 = dqx * nqy;
        const q02 = dqx * nqz;
        const q03 = dqx * qw;
        const q12 = dqy * nqz;
        const q13 = dqy * qw;
        const q23 = dqz * qw;
        const isx = 1 / sx, isy = 1 / sy, isz = 1 / sz;
        this.m00 = isx * (1.0 - q11 - q22);
        this.m01 = isy * (q01 + q23);
        this.m02 = isz * (q02 - q13);
        this.m03 = 0.0;
        this.m10 = isx * (q01 - q23);
        this.m11 = isy * (1.0 - q22 - q00);
        this.m12 = isz * (q12 + q03);
        this.m13 = 0.0;
        this.m20 = isx * (q02 + q13);
        this.m21 = isy * (q12 - q03);
        this.m22 = isz * (1.0 - q11 - q00);
        this.m23 = 0.0;
        this.m30 = -this.m00 * tx - this.m10 * ty - this.m20 * tz;
        this.m31 = -this.m01 * tx - this.m11 * ty - this.m21 * tz;
        this.m32 = -this.m02 * tx - this.m12 * ty - this.m22 * tz;
        this.m33 = 1.0;
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Set <code>this</code> matrix to <code>T * R * S * M</code>, where <code>T</code> is the given <code>translation</code>,
     * <code>R</code> is a rotation - and possibly scaling - transformation specified by the given quaternion, <code>S</code> is a scaling transformation
     * which scales the axes by <code>scale</code> and <code>M</code> is an {@link #isAffine() affine} matrix.
     * <p>
     * When transforming a vector by the resulting matrix the transformation described by <code>M</code> will be applied first, then the scaling, then rotation and
     * at last the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(translation).rotate(quat).scale(scale).mulAffine(m)</code>
     * 
     * @see #translation(Vector3fc)
     * @see #rotate(Quaterniondc)
     * @see #mulAffine(Matrix4dc)
     * 
     * @param translation
     *          the translation
     * @param quat
     *          the quaternion representing a rotation
     * @param scale
     *          the scaling factors
     * @param m
     *          the {@link #isAffine() affine} matrix to multiply by
     * @return this
     */
    public translationRotateScaleMulAffine(translation: Vector3, quat: Quaternion, scale: Vector3, m: Matrix4): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>T * R * S * M</code>, where <code>T</code> is a translation by the given <code>(tx, ty, tz)</code>,
     * <code>R</code> is a rotation - and possibly scaling - transformation specified by the quaternion <code>(qx, qy, qz, qw)</code>, <code>S</code> is a scaling transformation
     * which scales the three axes x, y and z by <code>(sx, sy, sz)</code> and <code>M</code> is an {@link #isAffine() affine} matrix.
     * <p>
     * When transforming a vector by the resulting matrix the transformation described by <code>M</code> will be applied first, then the scaling, then rotation and
     * at last the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(tx, ty, tz).rotate(quat).scale(sx, sy, sz).mulAffine(m)</code>
     * 
     * @see #translation(double, double, double)
     * @see #rotate(Quaterniondc)
     * @see #scale(double, double, double)
     * @see #mulAffine(Matrix4dc)
     * 
     * @param tx
     *          the number of units by which to translate the x-component
     * @param ty
     *          the number of units by which to translate the y-component
     * @param tz
     *          the number of units by which to translate the z-component
     * @param qx
     *          the x-coordinate of the vector part of the quaternion
     * @param qy
     *          the y-coordinate of the vector part of the quaternion
     * @param qz
     *          the z-coordinate of the vector part of the quaternion
     * @param qw
     *          the scalar part of the quaternion
     * @param sx
     *          the scaling factor for the x-axis
     * @param sy
     *          the scaling factor for the y-axis
     * @param sz
     *          the scaling factor for the z-axis
     * @param m
     *          the {@link #isAffine() affine} matrix to multiply by
     * @return this
     */
    public translationRotateScaleMulAffine(
        tx: number, ty: number, tz: number,
        qx: number, qy: number, qz: number, qw: number,
        sx: number, sy: number, sz: number,
        m: Matrix4): Matrix4;
    public translationRotateScaleMulAffine(
        tx: number | Vector3, ty: number | Quaternion, tz: number | Vector3,
        qx: number | Matrix4, qy?: number, qz?: number, qw?: number,
        sx?: number, sy?: number, sz?: number,
        m?: Matrix4): Matrix4 {
        if (qx instanceof Matrix4) {
            m = qx;
            qx = 0;
        }
        if (tz instanceof Vector3) {
            sz = tz.z, sy = tz.y, sx = tz.x;
            tz = 0;
        }
        if (ty instanceof Quaternion) {
            qw = ty.w, qz = ty.z, qy = ty.y, qx = ty.x;
            ty = 0;
        }
        if (tx instanceof Vector3) {
            tz = tx.z, ty = tx.y, tx = tx.x;
        }
        qx = qx as number;

        const w2 = qw * qw;
        const x2 = qx * qx;
        const y2 = qy * qy;
        const z2 = qz * qz;
        const zw = qz * qw;
        const xy = qx * qy;
        const xz = qx * qz;
        const yw = qy * qw;
        const yz = qy * qz;
        const xw = qx * qw;
        const nm00 = w2 + x2 - z2 - y2;
        const nm01 = xy + zw + zw + xy;
        const nm02 = xz - yw + xz - yw;
        const nm10 = -zw + xy - zw + xy;
        const nm11 = y2 - z2 + w2 - x2;
        const nm12 = yz + yz + xw + xw;
        const nm20 = yw + xz + xz + yw;
        const nm21 = yz + yz - xw - xw;
        const nm22 = z2 - y2 - x2 + w2;
        const m00 = nm00 * m.m00 + nm10 * m.m01 + nm20 * m.m02;
        const m01 = nm01 * m.m00 + nm11 * m.m01 + nm21 * m.m02;
        this.m02 = nm02 * m.m00 + nm12 * m.m01 + nm22 * m.m02;
        this.m00 = m00;
        this.m01 = m01;
        this.m03 = 0.0;
        const m10 = nm00 * m.m10 + nm10 * m.m11 + nm20 * m.m12;
        const m11 = nm01 * m.m10 + nm11 * m.m11 + nm21 * m.m12;
        this.m12 = nm02 * m.m10 + nm12 * m.m11 + nm22 * m.m12;
        this.m10 = m10;
        this.m11 = m11;
        this.m13 = 0.0;
        const m20 = nm00 * m.m20 + nm10 * m.m21 + nm20 * m.m22;
        const m21 = nm01 * m.m20 + nm11 * m.m21 + nm21 * m.m22;
        this.m22 = nm02 * m.m20 + nm12 * m.m21 + nm22 * m.m22;
        this.m20 = m20;
        this.m21 = m21;
        this.m23 = 0.0;
        const m30 = nm00 * m.m30 + nm10 * m.m31 + nm20 * m.m32 + tx;
        const m31 = nm01 * m.m30 + nm11 * m.m31 + nm21 * m.m32 + ty;
        this.m32 = nm02 * m.m30 + nm12 * m.m31 + nm22 * m.m32 + tz;
        this.m30 = m30;
        this.m31 = m31;
        this.m33 = 1.0;
        return this;
    }

    /**
     * Set <code>this</code> matrix to <code>T * R</code>, where <code>T</code> is a translation by the given <code>(tx, ty, tz)</code> and
     * <code>R</code> is a rotation - and possibly scaling - transformation specified by the quaternion <code>(qx, qy, qz, qw)</code>.
     * <p>
     * When transforming a vector by the resulting matrix the rotation - and possibly scaling - transformation will be applied first and then the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(tx, ty, tz).rotate(quat)</code>
     * 
     * @see #translation(double, double, double)
     * @see #rotate(Quaterniondc)
     * 
     * @param tx
     *          the number of units by which to translate the x-component
     * @param ty
     *          the number of units by which to translate the y-component
     * @param tz
     *          the number of units by which to translate the z-component
     * @param qx
     *          the x-coordinate of the vector part of the quaternion
     * @param qy
     *          the y-coordinate of the vector part of the quaternion
     * @param qz
     *          the z-coordinate of the vector part of the quaternion
     * @param qw
     *          the scalar part of the quaternion
     * @return this
     */
    public translationRotate(tx: number, ty: number, tz: number, qx: number, qy: number, qz: number, qw: number): Matrix4;

    /**
     * Set <code>this</code> matrix to <code>T * R</code>, where <code>T</code> is a translation by the given <code>(tx, ty, tz)</code> and
     * <code>R</code> is a rotation - and possibly scaling - transformation specified by the given quaternion.
     * <p>
     * When transforming a vector by the resulting matrix the rotation - and possibly scaling - transformation will be applied first and then the translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * This method is equivalent to calling: <code>translation(tx, ty, tz).rotate(quat)</code>
     * 
     * @see #translation(double, double, double)
     * @see #rotate(Quaterniondc)
     * 
     * @param tx
     *          the number of units by which to translate the x-component
     * @param ty
     *          the number of units by which to translate the y-component
     * @param tz
     *          the number of units by which to translate the z-component
     * @param quat
     *          the quaternion representing a rotation
     * @return this
     */
    public translationRotate(tx: number, ty: number, tz: number, quat: Quaternion): Matrix4;
    public translationRotate(tx: number, ty: number, tz: number, qx: number | Quaternion, qy?: number, qz?: number, qw?: number): Matrix4 {
        if (qx instanceof Quaternion) {
            qw = qx.w, qz = qx.z, qy = qx.y, qx = qx.x;
        }
        const w2 = qw * qw;
        const x2 = qx * qx;
        const y2 = qy * qy;
        const z2 = qz * qz;
        const zw = qz * qw;
        const xy = qx * qy;
        const xz = qx * qz;
        const yw = qy * qw;
        const yz = qy * qz;
        const xw = qx * qw;
        this.m00 = w2 + x2 - z2 - y2;
        this.m01 = xy + zw + zw + xy;
        this.m02 = xz - yw + xz - yw;
        this.m10 = -zw + xy - zw + xy;
        this.m11 = y2 - z2 + w2 - x2;
        this.m12 = yz + yz + xw + xw;
        this.m20 = yw + xz + xz + yw;
        this.m21 = yz + yz - xw - xw;
        this.m22 = z2 - y2 - x2 + w2;
        this.m30 = tx;
        this.m31 = ty;
        this.m32 = tz;
        this.m33 = 1.0;
        // this.properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
        return this;
    }

    /**
     * Apply the rotation - and possibly scaling - transformation of the given {@link Quaterniondc} to this matrix and store
     * the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>Q</code> the rotation matrix obtained from the given quaternion,
     * then the new matrix will be <code>M * Q</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * Q * v</code>,
     * the quaternion rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying,
     * use {@link #rotation(Quaternion)}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @see #rotation(Quaterniondc)
     * 
     * @param quat
     *          the {@link Quaternion}
     * @param dest
     *          will hold the result
     * @return dest
     */
    // public rotate(quat: Quaternion, dest?: Matrix4): Matrix4 {
    //     if (this.PROPERTY_IDENTITY)
    //         return dest.rotation(quat);
    //     else if (this.PROPERTY_TRANSLATION)
    //         return this.rotateTranslation(quat, dest);
    //     else if (this.PROPERTY_AFFINE)
    //         return this.rotateAffine(quat, dest);
    //     return this.rotateGeneric(quat, dest);
    // }
    // private rotateGeneric(quat: Quaternion, dest?: Matrix4): Matrix4 {
    //     dest = dest ?? this;
    //     const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
    //     const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
    //     const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
    //     const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
    //     const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
    //     const rm00 = w2 + x2 - z2 - y2;
    //     const rm01 = dxy + dzw;
    //     const rm02 = dxz - dyw;
    //     const rm10 = -dzw + dxy;
    //     const rm11 = y2 - z2 + w2 - x2;
    //     const rm12 = dyz + dxw;
    //     const rm20 = dyw + dxz;
    //     const rm21 = dyz - dxw;
    //     const rm22 = z2 - y2 - x2 + w2;
    //     return dest.set(
    //         this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02,
    //         this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02,
    //         this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02,
    //         this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02,
    //         this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12,
    //         this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12,
    //         this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12,
    //         this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12,
    //         this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22,
    //         this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22,
    //         this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22,
    //         this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22,
    //         this.m30,
    //         this.m31,
    //         this.m32,
    //         this.m33,
    //     );
    //     //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
    //     // return dest;
    // }

    /**
     * Apply the rotation - and possibly scaling - transformation of the given {@link Quaterniondc} to this {@link #isAffine() affine} matrix and store
     * the result in <code>dest</code>.
     * <p>
     * This method assumes <code>this</code> to be {@link #isAffine() affine}.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>Q</code> the rotation matrix obtained from the given quaternion,
     * then the new matrix will be <code>M * Q</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * Q * v</code>,
     * the quaternion rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying,
     * use {@link #rotation(Quaternion)}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @see #rotation(Quaterniondc)
     * 
     * @param quat
     *          the {@link Quaternion}
     * @param dest
     *          will hold the result
     * @return dest
     */
    // public rotateAffine(quat: Quaternion, dest?: Matrix4): Matrix4 {
    //     dest = dest ?? this;
    //     const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
    //     const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
    //     const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
    //     const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
    //     const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
    //     const rm00 = w2 + x2 - z2 - y2;
    //     const rm01 = dxy + dzw;
    //     const rm02 = dxz - dyw;
    //     const rm10 = -dzw + dxy;
    //     const rm11 = y2 - z2 + w2 - x2;
    //     const rm12 = dyz + dxw;
    //     const rm20 = dyw + dxz;
    //     const rm21 = dyz - dxw;
    //     const rm22 = z2 - y2 - x2 + w2;
    //     return dest.set(
    //         this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02,
    //         this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02,
    //         this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02,
    //         0.0,
    //         this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12,
    //         this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12,
    //         this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12,
    //         0.0,
    //         this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22,
    //         this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22,
    //         this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22,
    //         0.0,
    //         this.m30,
    //         this.m31,
    //         this.m32,
    //         this.m33,
    //     );
    //     //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
    //     // return dest;
    // }

    /**
     * Apply the rotation - and possibly scaling - transformation of the given {@link Quaterniondc} to this matrix, which is assumed to only contain a translation, and store
     * the result in <code>dest</code>.
     * <p>
     * This method assumes <code>this</code> to only contain a translation.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>Q</code> the rotation matrix obtained from the given quaternion,
     * then the new matrix will be <code>M * Q</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * Q * v</code>,
     * the quaternion rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying,
     * use {@link #rotation(Quaternion)}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @see #rotation(Quaterniondc)
     * 
     * @param quat
     *          the {@link Quaternion}
     * @param dest
     *          will hold the result
     * @return dest
     */
    // public rotateTranslation(quat: Quaternion, dest: Matrix4): Matrix4 {
    //     const w2 = quat.w * quat.w, x2 = quat.x * quat.x;
    //     const y2 = quat.y * quat.y, z2 = quat.z * quat.z;
    //     const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
    //     const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
    //     const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
    //     const rm00 = w2 + x2 - z2 - y2;
    //     const rm01 = dxy + dzw;
    //     const rm02 = dxz - dyw;
    //     const rm10 = -dzw + dxy;
    //     const rm11 = y2 - z2 + w2 - x2;
    //     const rm12 = dyz + dxw;
    //     const rm20 = dyw + dxz;
    //     const rm21 = dyz - dxw;
    //     const rm22 = z2 - y2 - x2 + w2;
    //     dest.m20 = rm20;
    //     dest.m21 = rm21;
    //     dest.m22 = rm22;
    //     dest.m23 = 0.0;
    //     dest.m00 = rm00;
    //     dest.m01 = rm01;
    //     dest.m02 = rm02;
    //     dest.m03 = 0.0;
    //     dest.m10 = rm10;
    //     dest.m11 = rm11;
    //     dest.m12 = rm12;
    //     dest.m13 = 0.0;
    //     dest.m30 = this.m30;
    //     dest.m31 = this.m31;
    //     dest.m32 = this.m32;
    //     dest.m33 = 1.0;
    //     // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
    //     return dest;
    // }

    /**
     * Pre-multiply the rotation - and possibly scaling - transformation of the given {@link Quaterniondc} to this matrix and store
     * the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>Q</code> the rotation matrix obtained from the given quaternion,
     * then the new matrix will be <code>Q * M</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>Q * M * v</code>,
     * the quaternion rotation will be applied last!
     * <p>
     * In order to set the matrix to a rotation transformation without pre-multiplying,
     * use {@link #rotation(Quaterniondc)}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion">http://en.wikipedia.org</a>
     * 
     * @see #rotation(Quaterniondc)
     * 
     * @param quat
     *          the {@link Quaterniondc}
     * @param dest
     *          will hold the result
     * @return dest
     */
    // public rotateLocal(quat: Quaternion, dest?: Matrix4): Matrix4 {
    //     dest = dest ?? this;
    //     const ww = quat.w * quat.w, xx = quat.x * quat.x;
    //     const yy = quat.y * quat.y, zz = quat.z * quat.z;
    //     const zw = quat.z * quat.w, dzw = zw + zw, xy = quat.x * quat.y, dxy = xy + xy;
    //     const xz = quat.x * quat.z, dxz = xz + xz, yw = quat.y * quat.w, dyw = yw + yw;
    //     const yz = quat.y * quat.z, dyz = yz + yz, xw = quat.x * quat.w, dxw = xw + xw;
    //     const lm00 = ww + xx - zz - yy;
    //     const lm01 = dxy + dzw;
    //     const lm02 = dxz - dyw;
    //     const lm10 = -dzw + dxy;
    //     const lm11 = yy - zz + ww - xx;
    //     const lm12 = dyz + dxw;
    //     const lm20 = dyw + dxz;
    //     const lm21 = dyz - dxw;
    //     const lm22 = zz - yy - xx + ww;
    //     return dest.set(
    //         lm00 * this.m00 + lm10 * this.m01 + lm20 * this.m02,
    //         lm01 * this.m00 + lm11 * this.m01 + lm21 * this.m02,
    //         lm02 * this.m00 + lm12 * this.m01 + lm22 * this.m02,
    //         this.m03,
    //         lm00 * this.m10 + lm10 * this.m11 + lm20 * this.m12,
    //         lm01 * this.m10 + lm11 * this.m11 + lm21 * this.m12,
    //         lm02 * this.m10 + lm12 * this.m11 + lm22 * this.m12,
    //         this.m13,
    //         lm00 * this.m20 + lm10 * this.m21 + lm20 * this.m22,
    //         lm01 * this.m20 + lm11 * this.m21 + lm21 * this.m22,
    //         lm02 * this.m20 + lm12 * this.m21 + lm22 * this.m22,
    //         this.m23,
    //         lm00 * this.m30 + lm10 * this.m31 + lm20 * this.m32,
    //         lm01 * this.m30 + lm11 * this.m31 + lm21 * this.m32,
    //         lm02 * this.m30 + lm12 * this.m31 + lm22 * this.m32,
    //         this.m33,
    //     );
    //     //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
    //     // return dest;
    // }

    /**
     * Apply a rotation transformation, rotating about the given {@link AxisAngle4d} and store the result in <code>dest</code>.
     * <p>
     * When used with a right-handed coordinate system, the produced rotation will rotate a vector 
     * counter-clockwise around the rotation axis, when viewing along the negative axis direction towards the origin.
     * When used with a left-handed coordinate system, the rotation is clockwise.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>A</code> the rotation matrix obtained from the given {@link AxisAngle4d},
     * then the new matrix will be <code>M * A</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * A * v</code>,
     * the {@link AxisAngle4d} rotation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying,
     * use {@link #rotation(AxisAngle4d)}.
     * <p>
     * Reference: <a href="http://en.wikipedia.org/wiki/Rotation_matrix#Axis_and_angle">http://en.wikipedia.org</a>
     * 
     * @see #rotate(double, double, double, double)
     * @see #rotation(AxisAngle4d)
     * 
     * @param axisAngle
     *          the {@link AxisAngle4d} (needs to be {@link AxisAngle4d#normalize() normalized})
     * @param dest
     *          will hold the result
     * @return dest
     */
    // public rotate(axisAngle: AxisAngle4, dest?: Matrix4): Matrix4 {
    //     return rotate(axisAngle.angle, axisAngle.x, axisAngle.y, axisAngle.z, dest);
    // }

    public getRow(row: number, dest: Vector3): Vector3;
    public getRow(row: number, dest?: Vector4): Vector4;
    public getRow(row: number, dest?: Vector3 | Vector4): Vector3 | Vector4 {
        dest = dest ?? new Vector4();
        switch (row) {
            case 0:
                dest.x = this.m00;
                dest.y = this.m10;
                dest.z = this.m20;
                if (dest instanceof Vector4)
                    dest.w = this.m30;
                break;
            case 1:
                dest.x = this.m01;
                dest.y = this.m11;
                dest.z = this.m21;
                if (dest instanceof Vector4)
                    dest.w = this.m31;
                break;
            case 2:
                dest.x = this.m02;
                dest.y = this.m12;
                dest.z = this.m22;
                if (dest instanceof Vector4)
                    dest.w = this.m32;
                break;
            case 3:
                dest.x = this.m03;
                dest.y = this.m13;
                dest.z = this.m23;
                if (dest instanceof Vector4)
                    dest.w = this.m33;
                break;
            default:
                throw "IndexOutOfBoundsException";
        }
        return dest;
    }

    /**
     * Set the row at the given <code>row</code> index, starting with <code>0</code>.
     * 
     * @param row
     *          the row index in <code>[0..3]</code>
     * @param src
     *          the row components to set
     * @return this
     * @throws IndexOutOfBoundsException if <code>row</code> is not in <code>[0..3]</code>
     */
    public setRow(row: number, src: Vector4): Matrix4 {
        switch (row) {
            case 0:
                this.m00 = src.x; this.m10 = src.y; this.m20 = src.z; this.m30 = src.w;
                return this;
            case 1:
                this.m01 = src.x; this.m11 = src.y; this.m21 = src.z; this.m31 = src.w;
                return this;
            case 2:
                this.m02 = src.x; this.m12 = src.y; this.m22 = src.z; this.m32 = src.w;
                return this;
            case 3:
                this.m03 = src.x; this.m13 = src.y; this.m23 = src.z; this.m33 = src.w;
                return this;
            default:
                throw "IndexOutOfBoundsException";
        }
    }

    public getColumn(column: number, dest: Vector3): Vector3;
    public getColumn(column: number, dest?: Vector4): Vector4;
    public getColumn(column: number, dest?: Vector3 | Vector4): Vector3 | Vector4 {
        dest = dest ?? new Vector4();
        switch (column) {
            case 0:
                dest.x = this.m00;
                dest.y = this.m01;
                dest.z = this.m02;
                if (dest instanceof Vector4)
                    dest.w = this.m03;
                break;
            case 1:
                dest.x = this.m10;
                dest.y = this.m11;
                dest.z = this.m12;
                if (dest instanceof Vector4)
                    dest.w = this.m13;
                break;
            case 2:
                dest.x = this.m20;
                dest.y = this.m21;
                dest.z = this.m22;
                if (dest instanceof Vector4)
                    dest.w = this.m23;
                break;
            case 3:
                dest.x = this.m30;
                dest.y = this.m31;
                dest.z = this.m32;
                if (dest instanceof Vector4)
                    dest.w = this.m33;
                break;
            default:
                throw "IndexOutOfBoundsException";
        }
        return dest;
    }

    /**
     * Set the column at the given <code>column</code> index, starting with <code>0</code>.
     * 
     * @param column
     *          the column index in <code>[0..3]</code>
     * @param src
     *          the column components to set
     * @return this
     * @throws IndexOutOfBoundsException if <code>column</code> is not in <code>[0..3]</code>
     */
    public setColumn(column: number, src: Vector4): Matrix4 {
        switch (column) {
            case 0:
                this.m00 = src.x; this.m01 = src.y; this.m02 = src.z; this.m03 = src.w;
                return this;
            case 1:
                this.m10 = src.x; this.m11 = src.y; this.m12 = src.z; this.m13 = src.w;
                return this;
            case 2:
                this.m20 = src.x; this.m21 = src.y; this.m22 = src.z; this.m23 = src.w;
                return this;
            case 3:
                this.m30 = src.x; this.m31 = src.y; this.m32 = src.z; this.m33 = src.w;
                return this;
            default:
                throw "IndexOutOfBoundsException";
        }
    }

    public getRowColumn(row: number, column: number): number {
        return this[column][row];
    }

    /**
     * Set the matrix element at the given row and column to the specified value.
     * 
     * @param row
     *          the row index in <code>[0..3]</code>
     * @param column
     *          the colum index in <code>[0..3]</code>
     * @param value
     *          the value
     * @return this
     */
    public setRowColumn(row: number, column: number, value: number): Matrix4 {
        this[column][row] = value;
        return this;
    }

    /**
     * Compute a normal matrix from the upper left 3x3 submatrix of <code>this</code>
     * and store it into the upper left 3x3 submatrix of <code>dest</code>.
     * All other values of <code>dest</code> will be set to {@link #identity() identity}.
     * <p>
     * The normal matrix of <code>m</code> is the transpose of the inverse of <code>m</code>.
     * <p>
     * Please note that, if <code>this</code> is an orthogonal matrix or a matrix whose columns are orthogonal vectors, 
     * then this method <i>need not</i> be invoked, since in that case <code>this</code> itself is its normal matrix.
     * In that case, use {@link #set3x3(Matrix4dc)} to set a given Matrix4d to only the upper left 3x3 submatrix
     * of a given matrix.
     * 
     * @see #set3x3(Matrix4dc)
     * 
     * @param dest
     *             will hold the result
     * @return dest
     */
    public normal(dest?: Matrix4): Matrix4;

    /**
     * Compute a normal matrix from the upper left 3x3 submatrix of <code>this</code>
     * and store it into <code>dest</code>.
     * <p>
     * The normal matrix of <code>m</code> is the transpose of the inverse of <code>m</code>.
     * <p>
     * Please note that, if <code>this</code> is an orthogonal matrix or a matrix whose columns are orthogonal vectors, 
     * then this method <i>need not</i> be invoked, since in that case <code>this</code> itself is its normal matrix.
     * In that case, use {@link Matrix3d#set(Matrix4dc)} to set a given Matrix3d to only the upper left 3x3 submatrix
     * of this matrix.
     * 
     * @see Matrix3d#set(Matrix4dc)
     * @see #get3x3(Matrix3d)
     * 
     * @param dest
     *             will hold the result
     * @return dest
     */
    public normal(dest: Matrix3): Matrix3;
    public normal(dest?: Matrix3 | Matrix4): Matrix3 | Matrix4 {
        dest = dest ?? this;
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalOrthonormal(dest);
        if (dest instanceof Matrix4) {
            if (this.PROPERTY_IDENTITY)
                return dest.identity();
            if (this.PROPERTY_ORTHONORMAL)
                return this.normalOrthonormal(dest);
        }
        return this.normalGeneric(dest);
    }
    private normalOrthonormal(dest: Matrix3 | Matrix4): Matrix3 | Matrix4 {
        if (dest === this) return this;
        return dest.set(this);
    }
    private normalGeneric(dest: Matrix3 | Matrix4): Matrix3 | Matrix4 {
        const m00m11 = this.m00 * this.m11;
        const m01m10 = this.m01 * this.m10;
        const m02m10 = this.m02 * this.m10;
        const m00m12 = this.m00 * this.m12;
        const m01m12 = this.m01 * this.m12;
        const m02m11 = this.m02 * this.m11;
        const det = (m00m11 - m01m10) * this.m22 + (m02m10 - m00m12) * this.m21 + (m01m12 - m02m11) * this.m20;
        const s = 1.0 / det;
        /* Invert and transpose in one go */
        const nm00 = (this.m11 * this.m22 - this.m21 * this.m12) * s;
        const nm01 = (this.m20 * this.m12 - this.m10 * this.m22) * s;
        const nm02 = (this.m10 * this.m21 - this.m20 * this.m11) * s;
        const nm10 = (this.m21 * this.m02 - this.m01 * this.m22) * s;
        const nm11 = (this.m00 * this.m22 - this.m20 * this.m02) * s;
        const nm12 = (this.m20 * this.m01 - this.m00 * this.m21) * s;
        const nm20 = (m01m12 - m02m11) * s;
        const nm21 = (m02m10 - m00m12) * s;
        const nm22 = (m00m11 - m01m10) * s;

        dest.m00 = nm00;
        dest.m01 = nm01;
        dest.m02 = nm02;
        dest.m10 = nm10;
        dest.m11 = nm11;
        dest.m12 = nm12;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        if (dest instanceof Matrix3) {
            return dest;
        }
        dest.m03 = 0.0;
        dest.m13 = 0.0;
        dest.m23 = 0.0;

        dest.m30 = 0.0;
        dest.m31 = 0.0;
        dest.m32 = 0.0;
        dest.m33 = 1.0;
        return dest;
        // ._properties((properties | PROPERTY_AFFINE) & ~(PROPERTY_TRANSLATION | PROPERTY_PERSPECTIVE));
    }

    /**
     * Compute the cofactor matrix of the upper left 3x3 submatrix of <code>this</code>
     * and store it into <code>dest</code>.
     * <p>
     * The cofactor matrix can be used instead of {@link #normal(Matrix3d)} to transform normals
     * when the orientation of the normals with respect to the surface should be preserved.
     * 
     * @param dest
     *             will hold the result
     * @return dest
     */
    public cofactor3x3(dest?: Matrix3): Matrix3;

    /**
     * Compute the cofactor matrix of the upper left 3x3 submatrix of <code>this</code>
     * and store it into <code>dest</code>.
     * All other values of <code>dest</code> will be set to {@link #identity() identity}.
     * <p>
     * The cofactor matrix can be used instead of {@link #normal(Matrix4d)} to transform normals
     * when the orientation of the normals with respect to the surface should be preserved.
     * 
     * @param dest
     *             will hold the result
     * @return dest
     */
    public cofactor3x3(dest?: Matrix4): Matrix4;
    public cofactor3x3(dest?: Matrix3 | Matrix4): Matrix3 | Matrix4 {
        dest = dest ?? this;
        const nm10 = this.m21 * this.m02 - this.m01 * this.m22;
        const nm11 = this.m00 * this.m22 - this.m20 * this.m02;
        const nm12 = this.m20 * this.m01 - this.m00 * this.m21;
        const nm20 = this.m01 * this.m12 - this.m11 * this.m02;
        const nm21 = this.m02 * this.m10 - this.m12 * this.m00;
        const nm22 = this.m00 * this.m11 - this.m10 * this.m01;

        dest.m00 = (this.m11 * this.m22 - this.m21 * this.m12)
        dest.m01 = (this.m20 * this.m12 - this.m10 * this.m22)
        dest.m02 = (this.m10 * this.m21 - this.m20 * this.m11)
        dest.m10 = (nm10)
        dest.m11 = (nm11)
        dest.m12 = (nm12)
        dest.m20 = (nm20)
        dest.m21 = (nm21)
        dest.m22 = (nm22)
        if (dest instanceof Matrix3) return dest;
        dest.m03 = (0.0)
        dest.m13 = (0.0)
        dest.m23 = (0.0)
        dest.m30 = (0.0)
        dest.m31 = (0.0)
        dest.m32 = (0.0)
        dest.m33 = (1.0)
        return dest;
        // ._properties((properties | PROPERTY_AFFINE) & ~(PROPERTY_TRANSLATION | PROPERTY_PERSPECTIVE));
    }

    /**
     * Normalize the upper left 3x3 submatrix of this matrix.
     * <p>
     * The resulting matrix will map unit vectors to unit vectors, though a pair of orthogonal input unit
     * vectors need not be mapped to a pair of orthogonal output vectors if the original matrix was not orthogonal itself
     * (i.e. had <i>skewing</i>).
     * 
     * @return this
     */

    public normalize3x3(dest?: Matrix4): Matrix4;
    public normalize3x3(dest: Matrix3): Matrix3;
    public normalize3x3(dest?: Matrix3 | Matrix4): Matrix3 | Matrix4 {
        dest = dest ?? this;

        const invXlen = 1 / Math.sqrt(this.m00 * this.m00 + this.m01 * this.m01 + this.m02 * this.m02);
        const invYlen = 1 / Math.sqrt(this.m10 * this.m10 + this.m11 * this.m11 + this.m12 * this.m12);
        const invZlen = 1 / Math.sqrt(this.m20 * this.m20 + this.m21 * this.m21 + this.m22 * this.m22);


        dest.m00 = this.m00 * invXlen;
        dest.m01 = this.m01 * invXlen;
        dest.m02 = this.m02 * invXlen;
        dest.m10 = this.m10 * invYlen;
        dest.m11 = this.m11 * invYlen;
        dest.m12 = this.m12 * invYlen;
        dest.m20 = this.m20 * invZlen;
        dest.m21 = this.m21 * invZlen;
        dest.m22 = this.m22 * invZlen;
        if (dest instanceof Matrix3) return dest;
        dest.m31 = this.m31;
        dest.m32 = this.m32;
        dest.m33 = this.m33;
        return dest;
    }


    public unproject(winCoords: Vector3, viewport: number[], dest: Vector3): Vector3;
    public unproject(winX: number, winY: number, winZ: number, viewport: number[], dest: Vector3): Vector4;
    public unproject(winCoords: Vector3, viewport: number[], dest?: Vector4): Vector4;
    public unproject(winX: number, winY: number, winZ: number, viewport: number[], dest?: Vector4): Vector4;

    public unproject(winX: number | Vector3, winY: number | number[], winZ?: number | Vector3 | Vector4, viewport?: number[], dest?: Vector4 | Vector3): Vector3 | Vector4 {
        dest = dest ?? (typeof winZ !== "number" ? winZ : new Vector4());
        if (typeof winY === "object") {
            viewport = winY;
        }
        if (winX instanceof Vector3) {
            winZ = winX.z, winY = winX.y, winX = winX.x;
        } else {
            winY = winY as number;
            winZ = winZ as number;
        }

        const a = this.m00 * this.m11 - this.m01 * this.m10;
        const b = this.m00 * this.m12 - this.m02 * this.m10;
        const c = this.m00 * this.m13 - this.m03 * this.m10;
        const d = this.m01 * this.m12 - this.m02 * this.m11;
        const e = this.m01 * this.m13 - this.m03 * this.m11;
        const f = this.m02 * this.m13 - this.m03 * this.m12;
        const g = this.m20 * this.m31 - this.m21 * this.m30;
        const h = this.m20 * this.m32 - this.m22 * this.m30;
        const i = this.m20 * this.m33 - this.m23 * this.m30;
        const j = this.m21 * this.m32 - this.m22 * this.m31;
        const k = this.m21 * this.m33 - this.m23 * this.m31;
        const l = this.m22 * this.m33 - this.m23 * this.m32;
        const det = 1 / (a * l - b * k + c * j + d * i - e * h + f * g);
        const im00 = (+this.m11 * l - this.m12 * k + this.m13 * j) * det;
        const im01 = (-this.m01 * l + this.m02 * k - this.m03 * j) * det;
        const im02 = (+this.m31 * f - this.m32 * e + this.m33 * d) * det;
        const im03 = (-this.m21 * f + this.m22 * e - this.m23 * d) * det;
        const im10 = (-this.m10 * l + this.m12 * i - this.m13 * h) * det;
        const im11 = (+this.m00 * l - this.m02 * i + this.m03 * h) * det;
        const im12 = (-this.m30 * f + this.m32 * c - this.m33 * b) * det;
        const im13 = (+this.m20 * f - this.m22 * c + this.m23 * b) * det;
        const im20 = (+this.m10 * k - this.m11 * i + this.m13 * g) * det;
        const im21 = (-this.m00 * k + this.m01 * i - this.m03 * g) * det;
        const im22 = (+this.m30 * e - this.m31 * c + this.m33 * a) * det;
        const im23 = (-this.m20 * e + this.m21 * c - this.m23 * a) * det;
        const im30 = (-this.m10 * j + this.m11 * h - this.m12 * g) * det;
        const im31 = (+this.m00 * j - this.m01 * h + this.m02 * g) * det;
        const im32 = (-this.m30 * d + this.m31 * b - this.m32 * a) * det;
        const im33 = (+this.m20 * d - this.m21 * b + this.m22 * a) * det;
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const ndcZ = winZ + winZ - 1.0;
        const invW = 1.0 / (im03 * ndcX + im13 * ndcY + im23 * ndcZ + im33);
        dest.x = (im00 * ndcX + im10 * ndcY + im20 * ndcZ + im30) * invW;
        dest.y = (im01 * ndcX + im11 * ndcY + im21 * ndcZ + im31) * invW;
        dest.z = (im02 * ndcX + im12 * ndcY + im22 * ndcZ + im32) * invW;
        if (dest instanceof Vector4)
            dest.w = 1.0;
        return dest;
    }

    public unprojectRay(winX: number, winY: number, viewport: number[], originDest: Vector3, dirDest: Vector3): Matrix4 {
        const a = this.m00 * this.m11 - this.m01 * this.m10;
        const b = this.m00 * this.m12 - this.m02 * this.m10;
        const c = this.m00 * this.m13 - this.m03 * this.m10;
        const d = this.m01 * this.m12 - this.m02 * this.m11;
        const e = this.m01 * this.m13 - this.m03 * this.m11;
        const f = this.m02 * this.m13 - this.m03 * this.m12;
        const g = this.m20 * this.m31 - this.m21 * this.m30;
        const h = this.m20 * this.m32 - this.m22 * this.m30;
        const i = this.m20 * this.m33 - this.m23 * this.m30;
        const j = this.m21 * this.m32 - this.m22 * this.m31;
        const k = this.m21 * this.m33 - this.m23 * this.m31;
        const l = this.m22 * this.m33 - this.m23 * this.m32;
        const det = 1 / (a * l - b * k + c * j + d * i - e * h + f * g);
        const im00 = (+this.m11 * l - this.m12 * k + this.m13 * j) * det;
        const im01 = (-this.m01 * l + this.m02 * k - this.m03 * j) * det;
        const im02 = (+this.m31 * f - this.m32 * e + this.m33 * d) * det;
        const im03 = (-this.m21 * f + this.m22 * e - this.m23 * d) * det;
        const im10 = (-this.m10 * l + this.m12 * i - this.m13 * h) * det;
        const im11 = (+this.m00 * l - this.m02 * i + this.m03 * h) * det;
        const im12 = (-this.m30 * f + this.m32 * c - this.m33 * b) * det;
        const im13 = (+this.m20 * f - this.m22 * c + this.m23 * b) * det;
        const im20 = (+this.m10 * k - this.m11 * i + this.m13 * g) * det;
        const im21 = (-this.m00 * k + this.m01 * i - this.m03 * g) * det;
        const im22 = (+this.m30 * e - this.m31 * c + this.m33 * a) * det;
        const im23 = (-this.m20 * e + this.m21 * c - this.m23 * a) * det;
        const im30 = (-this.m10 * j + this.m11 * h - this.m12 * g) * det;
        const im31 = (+this.m00 * j - this.m01 * h + this.m02 * g) * det;
        const im32 = (-this.m30 * d + this.m31 * b - this.m32 * a) * det;
        const im33 = (+this.m20 * d - this.m21 * b + this.m22 * a) * det;
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const px = im00 * ndcX + im10 * ndcY + im30;
        const py = im01 * ndcX + im11 * ndcY + im31;
        const pz = im02 * ndcX + im12 * ndcY + im32;
        const invNearW = 1.0 / (im03 * ndcX + im13 * ndcY - im23 + im33);
        const nearX = (px - im20) * invNearW;
        const nearY = (py - im21) * invNearW;
        const nearZ = (pz - im22) * invNearW;
        const invW0 = 1.0 / (im03 * ndcX + im13 * ndcY + im33);
        const x0 = px * invW0;
        const y0 = py * invW0;
        const z0 = pz * invW0;
        originDest.x = nearX; originDest.y = nearY; originDest.z = nearZ;
        dirDest.x = x0 - nearX; dirDest.y = y0 - nearY; dirDest.z = z0 - nearZ;
        return this;
    }

    public unprojectInv(winCoords: Vector3, viewport: number[], dest: Vector4): Vector4;
    public unprojectInv(winX: number, winY: number, winZ: number, viewport: number[], dest: Vector4): Vector4;
    public unprojectInv(winCoords: Vector3, viewport: number[], dest: Vector3 | Vector4): Vector3;
    public unprojectInv(winX: number, winY: number, winZ: number, viewport: number[], dest: Vector3): Vector3;
    public unprojectInv(winX: number | Vector3, winY: number | number[], winZ: number | Vector3 | Vector4, viewport?: number[], dest?: Vector3 | Vector4): Vector3 | Vector4 {
        if (winX instanceof Vector3) {
            dest = winZ as Vector3 | Vector4;
            viewport = winY as number[];
            winZ = winX.z;
            winY = winX.y;
            winX = winX.x;
        } else {
            dest = dest as Vector3 | Vector4;
            viewport = viewport as number[];
            winZ = winZ as number;
            winY = winY as number;
        }

        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const ndcZ = winZ + winZ - 1.0;
        const invW = 1.0 / (this.m03 * ndcX + this.m13 * ndcY + this.m23 * ndcZ + this.m33);
        dest.x = (this.m00 * ndcX + this.m10 * ndcY + this.m20 * ndcZ + this.m30) * invW;
        dest.y = (this.m01 * ndcX + this.m11 * ndcY + this.m21 * ndcZ + this.m31) * invW;
        dest.z = (this.m02 * ndcX + this.m12 * ndcY + this.m22 * ndcZ + this.m32) * invW;
        if (dest instanceof Vector4) dest.w = 1;
        return dest;
    }

    public unprojectInvRay(winX: number, winY: number, viewport: number[], originDest: Vector3, dirDest: Vector3): Matrix4 {
        const ndcX = (winX - viewport[0]) / viewport[2] * 2.0 - 1.0;
        const ndcY = (winY - viewport[1]) / viewport[3] * 2.0 - 1.0;
        const px = this.m00 * ndcX + this.m10 * ndcY + this.m30;
        const py = this.m01 * ndcX + this.m11 * ndcY + this.m31;
        const pz = this.m02 * ndcX + this.m12 * ndcY + this.m32;
        const invNearW = 1.0 / (this.m03 * ndcX + this.m13 * ndcY - this.m23 + this.m33);
        const nearX = (px - this.m20) * invNearW;
        const nearY = (py - this.m21) * invNearW;
        const nearZ = (pz - this.m22) * invNearW;
        const invW0 = 1.0 / (this.m03 * ndcX + this.m13 * ndcY + this.m33);
        const x0 = px * invW0;
        const y0 = py * invW0;
        const z0 = pz * invW0;
        originDest.x = nearX; originDest.y = nearY; originDest.z = nearZ;
        dirDest.x = x0 - nearX; dirDest.y = y0 - nearY; dirDest.z = z0 - nearZ;
        return this;
    }

    public project(position: Vector3, viewport: number[], dest?: Vector3): Vector3;
    public project(x: number, y: number, z: number, viewport: number[], dest?: Vector3): Vector3;
    public project(x: number | Vector3, y: number | number[], z?: number | Vector3, viewport?: number[], dest?: Vector3): Vector3 {
        dest = dest ?? (z instanceof Vector3 ? z : new Vector3());
        if (x instanceof Vector3) {
            viewport = y as number[];
            z = x.z, y = x.y, x = x.x;
        } else {
            y = y as number;
            z = z as number;
        }
        const invW = 1.0 / (this.m03 * x + this.m13 * y + this.m23 * z + this.m33);
        const nx = (this.m00 * x + this.m10 * y + this.m20 * z + this.m30) * invW;
        const ny = (this.m01 * x + this.m11 * y + this.m21 * z + this.m31) * invW;
        const nz = (this.m02 * x + this.m12 * y + this.m22 * z + this.m32) * invW;
        dest.x = (nx * 0.5 + 0.5) * viewport[2] + viewport[0];
        dest.y = (ny * 0.5 + 0.5) * viewport[3] + viewport[1];
        dest.z = 0.5 * nz + 0.5;
        return dest;
    }

    /**
     * Apply a mirror/reflection transformation to this matrix that reflects about the given plane
     * specified via the plane normal and a point on the plane.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the reflection matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * reflection will be applied first!
     * 
     * @param nx
     *          the x-coordinate of the plane normal
     * @param ny
     *          the y-coordinate of the plane normal
     * @param nz
     *          the z-coordinate of the plane normal
     * @param px
     *          the x-coordinate of a point on the plane
     * @param py
     *          the y-coordinate of a point on the plane
     * @param pz
     *          the z-coordinate of a point on the plane
     * @return this
     */
    public reflect(nx: number, ny: number, nz: number, px: number, py: number, pz: number, dest?: Matrix4): Matrix4;

    /**
     * Apply a mirror/reflection transformation to this matrix that reflects about the given plane
     * specified via the plane normal and a point on the plane.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the reflection matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * reflection will be applied first!
     * 
     * @param normal
     *          the plane normal
     * @param point
     *          a point on the plane
     * @return this
     */
    public reflect(normal: Vector3, point: Vector3, dest: Matrix4): Matrix4;

    /**
     * Apply a mirror/reflection transformation to this matrix that reflects about a plane
     * specified via the plane orientation and a point on the plane.
     * <p>
     * This method can be used to build a reflection transformation based on the orientation of a mirror object in the scene.
     * It is assumed that the default mirror plane's normal is <code>(0, 0, 1)</code>. So, if the given {@link Quaterniondc} is
     * the identity (does not apply any additional rotation), the reflection plane will be <code>z=0</code>, offset by the given <code>point</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the reflection matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * reflection will be applied first!
     * 
     * @param orientation
     *          the plane orientation relative to an implied normal vector of <code>(0, 0, 1)</code>
     * @param point
     *          a point on the plane
     * @return this
     */
    public reflect(orientation: Quaternion, point: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply a mirror/reflection transformation to this matrix that reflects about the given plane
     * specified via the equation <code>x*a + y*b + z*c + d = 0</code>.
     * <p>
     * The vector <code>(a, b, c)</code> must be a unit vector.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>R</code> the reflection matrix,
     * then the new matrix will be <code>M * R</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * R * v</code>, the
     * reflection will be applied first!
     * <p>
     * Reference: <a href="https://msdn.microsoft.com/en-us/library/windows/desktop/bb281733(v=vs.85).aspx">msdn.microsoft.com</a>
     * 
     * @param a
     *          the x factor in the plane equation
     * @param b
     *          the y factor in the plane equation
     * @param c
     *          the z factor in the plane equation
     * @param d
     *          the constant in the plane equation
     * @return this
     */
    public reflect(a: number, b: number, c: number, d: number, dest?: Matrix4): Matrix4;
    public reflect(a: number | Vector3 | Quaternion, b: number | Vector3, c?: number | Matrix4, px?: number, py?: number | Matrix4, pz?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (py instanceof Matrix4 ? py : (c instanceof Matrix4 ? c : this));

        if (a instanceof Quaternion) {
            b = b as Vector3;
            pz = b.z, py = b.y, px = b.x;

            const num1 = a.x + a.x;
            const num2 = a.y + a.y;
            const num3 = a.z + a.z;
            c = 1.0 - (a.x * num1 + a.y * num2);
            b = a.y * num3 - a.w * num1;
            a = a.x * num3 + a.w * num2;
        }


        if (b instanceof Vector3) {
            pz = b.z, py = b.y, px = b.x;
        } else {
            py = py as number;
        }
        if (a instanceof Vector3) {
            c = a.z, b = a.y, a = a.x;
        } else {
            c = c as number;
            b = b as number;
        }

        let d: number = px;
        if (py) {
            /* See: http://mathworld.wolfram.com/Plane.html */
            const invLength = 1 / Math.sqrt(a * a + b * b + c * c);
            a *= invLength;
            b *= invLength;
            c *= invLength;
            d = -a * px - b * py - c * pz;
        }

        if (this.PROPERTY_IDENTITY)
            return dest.reflection(a, b, c, d);
        if (this.PROPERTY_IDENTITY)
            return dest.reflection(a, b, c, d);
        if (this.PROPERTY_AFFINE)
            return this.reflectAffine(a, b, c, d, dest);
        return this.reflectGeneric(a, b, c, d, dest);
    }
    private reflectAffine(a: number, b: number, c: number, d: number, dest: Matrix4): Matrix4 {
        const da = a + a, db = b + b, dc = c + c, dd = d + d;
        const rm00 = 1.0 - da * a;
        const rm01 = -da * b;
        const rm02 = -da * c;
        const rm10 = -db * a;
        const rm11 = 1.0 - db * b;
        const rm12 = -db * c;
        const rm20 = -dc * a;
        const rm21 = -dc * b;
        const rm22 = 1.0 - dc * c;
        const rm30 = -dd * a;
        const rm31 = -dd * b;
        const rm32 = -dd * c;
        // matrix multiplication
        return dest.set(
            this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02,
            this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02,
            this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02,
            0,
            this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12,
            this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12,
            this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12,
            0,
            this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22,
            this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22,
            this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22,
            0,
            this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30,
            this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31,
            this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32,
            this.m33,
        );
    }
    private reflectGeneric(a: number, b: number, c: number, d: number, dest: Matrix4): Matrix4 {
        const da = a + a, db = b + b, dc = c + c, dd = d + d;
        const rm00 = 1.0 - da * a;
        const rm01 = -da * b;
        const rm02 = -da * c;
        const rm10 = -db * a;
        const rm11 = 1.0 - db * b;
        const rm12 = -db * c;
        const rm20 = -dc * a;
        const rm21 = -dc * b;
        const rm22 = 1.0 - dc * c;
        const rm30 = -dd * a;
        const rm31 = -dd * b;
        const rm32 = -dd * c;
        // matrix multiplication
        return dest.set(
            this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02,
            this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02,
            this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02,
            this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02,
            this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12,
            this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12,
            this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12,
            this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12,
            this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22,
            this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22,
            this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22,
            this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22,
            this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30,
            this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31,
            this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32,
            this.m03 * rm30 + this.m13 * rm31 + this.m23 * rm32 + this.m33,
        );
    }

    /**
     * Set this matrix to a mirror/reflection transformation that reflects about the given plane
     * specified via the equation <code>x*a + y*b + z*c + d = 0</code>.
     * <p>
     * The vector <code>(a, b, c)</code> must be a unit vector.
     * <p>
     * Reference: <a href="https://msdn.microsoft.com/en-us/library/windows/desktop/bb281733(v=vs.85).aspx">msdn.microsoft.com</a>
     * 
     * @param a
     *          the x factor in the plane equation
     * @param b
     *          the y factor in the plane equation
     * @param c
     *          the z factor in the plane equation
     * @param d
     *          the constant in the plane equation
     * @return this
     */
    public reflection(a: number, b: number, c: number, d: number): Matrix4;

    /**
     * Set this matrix to a mirror/reflection transformation that reflects about the given plane
     * specified via the plane normal and a point on the plane.
     * 
     * @param normal
     *          the plane normal
     * @param point
     *          a point on the plane
     * @return this
     */
    public reflection(normal: Vector3, point: Vector3): Matrix4;

    /**
     * Set this matrix to a mirror/reflection transformation that reflects about a plane
     * specified via the plane orientation and a point on the plane.
     * <p>
     * This method can be used to build a reflection transformation based on the orientation of a mirror object in the scene.
     * It is assumed that the default mirror plane's normal is <code>(0, 0, 1)</code>. So, if the given {@link Quaterniondc} is
     * the identity (does not apply any additional rotation), the reflection plane will be <code>z=0</code>, offset by the given <code>point</code>.
     * 
     * @param orientation
     *          the plane orientation
     * @param point
     *          a point on the plane
     * @return this
     */
    public reflection(orientation: Quaternion, point: Vector3): Matrix4;

    /**
     * Set this matrix to a mirror/reflection transformation that reflects about the given plane
     * specified via the plane normal and a point on the plane.
     * 
     * @param nx
     *          the x-coordinate of the plane normal
     * @param ny
     *          the y-coordinate of the plane normal
     * @param nz
     *          the z-coordinate of the plane normal
     * @param px
     *          the x-coordinate of a point on the plane
     * @param py
     *          the y-coordinate of a point on the plane
     * @param pz
     *          the z-coordinate of a point on the plane
     * @return this
     */
    public reflection(nx: number, ny: number, nz: number, px: number, py: number, pz: number): Matrix4;
    public reflection(a: number | Vector3 | Quaternion, b: number | Vector3, c?: number, px?: number, py?: number, pz?: number): Matrix4 {

        if (a instanceof Quaternion) {
            b = b as Vector3;
            pz = b.z, py = b.y, px = b.x;

            const num1 = a.x + a.x;
            const num2 = a.y + a.y;
            const num3 = a.z + a.z;
            c = 1.0 - (a.x * num1 + a.y * num2);
            b = a.y * num3 - a.w * num1;
            a = a.x * num3 + a.w * num2;
        }

        if (b instanceof Vector3) {
            pz = b.z, py = b.y, px = b.x;
        }
        if (a instanceof Vector3) {
            c = a.z, b = a.y, a = a.x;
        } else {
            b = b as number;
        }

        let d: number = px;
        if (py) {
            /* See: http://mathworld.wolfram.com/Plane.html */
            const invLength = 1 / Math.sqrt(a * a + b * b + c * c);
            a *= invLength;
            b *= invLength;
            c *= invLength;
            d = -a * px - b * py - c * pz;
        }
        const da = a + a, db = b + b, dc = c + c, dd = d + d;
        this.m00 = 1.0 - da * a;
        this.m01 = -da * b;
        this.m02 = -da * c;
        this.m03 = 0.0;
        this.m10 = -db * a;
        this.m11 = 1.0 - db * b;
        this.m12 = -db * c;
        this.m13 = 0.0;
        this.m20 = -dc * a;
        this.m21 = -dc * b;
        this.m22 = 1.0 - dc * c;
        this.m23 = 0.0;
        this.m30 = -dd * a;
        this.m31 = -dd * b;
        this.m32 = -dd * c;
        this.m33 = 1.0;
        return this;
    }

    /**
     * Apply an orthographic projection transformation for a right-handed coordinate system
     * using OpenGL's NDC z range of <code>[-1..+1]</code> to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to an orthographic projection without post-multiplying it,
     * use {@link #setOrtho(double, double, double, double, double, double) setOrtho()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrtho(double, double, double, double, double, double)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param dest
     *            will hold the result
     * @return dest
     */
    public ortho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    /**
     * Apply an orthographic projection transformation for a right-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to an orthographic projection without post-multiplying it,
     * use {@link #setOrtho(double, double, double, double, double, double, boolean) setOrtho()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrtho(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @param dest
     *            will hold the result
     * @return dest
     */
    public ortho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public ortho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setOrtho(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.orthoGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    private orthoGeneric(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zNear - zFar);
        const rm30 = (left + right) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // perform optimized multiplication
        // compute the last column first, because other columns do not depend on it
        dest.m30 = this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30;
        dest.m31 = this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31;
        dest.m32 = this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32;
        dest.m33 = this.m03 * rm30 + this.m13 * rm31 + this.m23 * rm32 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m20 = this.m20 * rm22;
        dest.m21 = this.m21 * rm22;
        dest.m22 = this.m22 * rm22;
        dest.m23 = this.m23 * rm22;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }


    /**
     * Apply an orthographic projection transformation for a left-handed coordiante system
     * using OpenGL's NDC z range of <code>[-1..+1]</code> to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to an orthographic projection without post-multiplying it,
     * use {@link #setOrthoLH(double, double, double, double, double, double) setOrthoLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoLH(double, double, double, double, double, double)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param dest
     *            will hold the result
     * @return dest
     */
    public orthoLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    /**
     * Apply an orthographic projection transformation for a left-handed coordiante system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to an orthographic projection without post-multiplying it,
     * use {@link #setOrthoLH(double, double, double, double, double, double, boolean) setOrthoLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoLH(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @param dest
     *            will hold the result
     * @return dest
     */
    public orthoLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public orthoLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setOrthoLH(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.orthoLHGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    private orthoLHGeneric(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        const rm30 = (left + right) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // perform optimized multiplication
        // compute the last column first, because other columns do not depend on it
        dest.m30 = this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30;
        dest.m31 = this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31;
        dest.m32 = this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32;
        dest.m33 = this.m03 * rm30 + this.m13 * rm31 + this.m23 * rm32 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m20 = this.m20 * rm22;
        dest.m21 = this.m21 * rm22;
        dest.m22 = this.m22 * rm22;
        dest.m23 = this.m23 * rm22;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }


    /**
     * Set this matrix to be an orthographic projection transformation for a right-handed coordinate system
     * using the given NDC z range.
     * <p>
     * In order to apply the orthographic projection to an already existing transformation,
     * use {@link #ortho(double, double, double, double, double, double, boolean) ortho()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #ortho(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setOrtho(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = 2.0 / (right - left);
        this.m11 = 2.0 / (top - bottom);
        this.m22 = (zZeroToOne ? 1.0 : 2.0) / (zNear - zFar);
        this.m30 = (right + left) / (left - right);
        this.m31 = (top + bottom) / (bottom - top);
        this.m32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Set this matrix to be an orthographic projection transformation for a left-handed coordinate system
     * using the given NDC z range.
     * <p>
     * In order to apply the orthographic projection to an already existing transformation,
     * use {@link #orthoLH(double, double, double, double, double, double, boolean) orthoLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #orthoLH(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setOrthoLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = 2.0 / (right - left);
        this.m11 = 2.0 / (top - bottom);
        this.m22 = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        this.m30 = (right + left) / (left - right);
        this.m31 = (top + bottom) / (bottom - top);
        this.m32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Apply a symmetric orthographic projection transformation for a right-handed coordinate system
     * using OpenGL's NDC z range of <code>[-1..+1]</code> to this matrix and store the result in <code>dest</code>.
     * <p>
     * This method is equivalent to calling {@link #ortho(double, double, double, double, double, double, Matrix4d) ortho()} with
     * <code>left=-width/2</code>, <code>right=+width/2</code>, <code>bottom=-height/2</code> and <code>top=+height/2</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to a symmetric orthographic projection without post-multiplying it,
     * use {@link #setOrthoSymmetric(double, double, double, double) setOrthoSymmetric()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoSymmetric(double, double, double, double)
     * 
     * @param width
     *            the distance between the right and left frustum edges
     * @param height
     *            the distance between the top and bottom frustum edges
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param dest
     *            will hold the result
     * @return dest
     */
    public orthoSymmetric(width: number, height: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    /**
     * Apply a symmetric orthographic projection transformation for a right-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * This method is equivalent to calling {@link #ortho(double, double, double, double, double, double, boolean, Matrix4d) ortho()} with
     * <code>left=-width/2</code>, <code>right=+width/2</code>, <code>bottom=-height/2</code> and <code>top=+height/2</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to a symmetric orthographic projection without post-multiplying it,
     * use {@link #setOrthoSymmetric(double, double, double, double, boolean) setOrthoSymmetric()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoSymmetric(double, double, double, double, boolean)
     * 
     * @param width
     *            the distance between the right and left frustum edges
     * @param height
     *            the distance between the top and bottom frustum edges
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param dest
     *            will hold the result
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return dest
     */
    public orthoSymmetric(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public orthoSymmetric(width: number, height: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setOrthoSymmetric(width, height, zNear, zFar, zZeroToOne);
        return this.orthoSymmetricGeneric(width, height, zNear, zFar, zZeroToOne, dest);
    }
    private orthoSymmetricGeneric(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = 2.0 / width;
        const rm11 = 2.0 / height;
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zNear - zFar);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // perform optimized multiplication
        // compute the last column first, because other columns do not depend on it
        dest.m30 = this.m20 * rm32 + this.m30;
        dest.m31 = this.m21 * rm32 + this.m31;
        dest.m32 = this.m22 * rm32 + this.m32;
        dest.m33 = this.m23 * rm32 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m20 = this.m20 * rm22;
        dest.m21 = this.m21 * rm22;
        dest.m22 = this.m22 * rm22;
        dest.m23 = this.m23 * rm22;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Apply a symmetric orthographic projection transformation for a left-handed coordinate system
     * using OpenGL's NDC z range of <code>[-1..+1]</code> to this matrix and store the result in <code>dest</code>.
     * <p>
     * This method is equivalent to calling {@link #orthoLH(double, double, double, double, double, double, Matrix4d) orthoLH()} with
     * <code>left=-width/2</code>, <code>right=+width/2</code>, <code>bottom=-height/2</code> and <code>top=+height/2</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to a symmetric orthographic projection without post-multiplying it,
     * use {@link #setOrthoSymmetricLH(double, double, double, double) setOrthoSymmetricLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoSymmetricLH(double, double, double, double)
     * 
     * @param width
     *            the distance between the right and left frustum edges
     * @param height
     *            the distance between the top and bottom frustum edges
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param dest
     *            will hold the result
     * @return dest
     */
    public orthoSymmetricLH(width: number, height: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;

    /**
     * Apply a symmetric orthographic projection transformation for a left-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * This method is equivalent to calling {@link #orthoLH(double, double, double, double, double, double, boolean, Matrix4d) orthoLH()} with
     * <code>left=-width/2</code>, <code>right=+width/2</code>, <code>bottom=-height/2</code> and <code>top=+height/2</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to a symmetric orthographic projection without post-multiplying it,
     * use {@link #setOrthoSymmetricLH(double, double, double, double, boolean) setOrthoSymmetricLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoSymmetricLH(double, double, double, double, boolean)
     * 
     * @param width
     *            the distance between the right and left frustum edges
     * @param height
     *            the distance between the top and bottom frustum edges
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param dest
     *            will hold the result
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return dest
     */
    public orthoSymmetricLH(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public orthoSymmetricLH(width: number, height: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setOrthoSymmetricLH(width, height, zNear, zFar, zZeroToOne);
        return this.orthoSymmetricLHGeneric(width, height, zNear, zFar, zZeroToOne, dest);
    }
    private orthoSymmetricLHGeneric(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = 2.0 / width;
        const rm11 = 2.0 / height;
        const rm22 = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        const rm32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // perform optimized multiplication
        // compute the last column first, because other columns do not depend on it
        dest.m30 = this.m20 * rm32 + this.m30;
        dest.m31 = this.m21 * rm32 + this.m31;
        dest.m32 = this.m22 * rm32 + this.m32;
        dest.m33 = this.m23 * rm32 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m20 = this.m20 * rm22;
        dest.m21 = this.m21 * rm22;
        dest.m22 = this.m22 * rm22;
        dest.m23 = this.m23 * rm22;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Set this matrix to be a symmetric orthographic projection transformation for a right-handed coordinate system
     * using the given NDC z range.
     * <p>
     * This method is equivalent to calling {@link #setOrtho(double, double, double, double, double, double, boolean) setOrtho()} with
     * <code>left=-width/2</code>, <code>right=+width/2</code>, <code>bottom=-height/2</code> and <code>top=+height/2</code>.
     * <p>
     * In order to apply the symmetric orthographic projection to an already existing transformation,
     * use {@link #orthoSymmetric(double, double, double, double, boolean) orthoSymmetric()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #orthoSymmetric(double, double, double, double, boolean)
     * 
     * @param width
     *            the distance between the right and left frustum edges
     * @param height
     *            the distance between the top and bottom frustum edges
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setOrthoSymmetric(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = (2.0 / width)
        this.m11 = (2.0 / height)
        this.m22 = ((zZeroToOne ? 1.0 : 2.0) / (zNear - zFar))
        this.m32 = ((zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar))
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Set this matrix to be a symmetric orthographic projection transformation for a left-handed coordinate system using the given NDC z range.
     * <p>
     * This method is equivalent to calling {@link #setOrtho(double, double, double, double, double, double, boolean) setOrtho()} with
     * <code>left=-width/2</code>, <code>right=+width/2</code>, <code>bottom=-height/2</code> and <code>top=+height/2</code>.
     * <p>
     * In order to apply the symmetric orthographic projection to an already existing transformation,
     * use {@link #orthoSymmetricLH(double, double, double, double, boolean) orthoSymmetricLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #orthoSymmetricLH(double, double, double, double, boolean)
     * 
     * @param width
     *            the distance between the right and left frustum edges
     * @param height
     *            the distance between the top and bottom frustum edges
     * @param zNear
     *            near clipping plane distance
     * @param zFar
     *            far clipping plane distance
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setOrthoSymmetricLH(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = 2.0 / width;
        this.m11 = 2.0 / height;
        this.m22 = (zZeroToOne ? 1.0 : 2.0) / (zFar - zNear);
        this.m32 = (zZeroToOne ? zNear : (zFar + zNear)) / (zNear - zFar);
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Apply an orthographic projection transformation for a right-handed coordinate system
     * to this matrix and store the result in <code>dest</code>.
     * <p>
     * This method is equivalent to calling {@link #ortho(double, double, double, double, double, double, Matrix4d) ortho()} with
     * <code>zNear=-1</code> and <code>zFar=+1</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to an orthographic projection without post-multiplying it,
     * use {@link #setOrtho2D(double, double, double, double) setOrtho()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #ortho(double, double, double, double, double, double, Matrix4d)
     * @see #setOrtho2D(double, double, double, double)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param dest
     *            will hold the result
     * @return dest
     */
    public ortho2D(left: number, right: number, bottom: number, top: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrtho2D(left, right, bottom, top);
        return this.ortho2DGeneric(left, right, bottom, top, dest);
    }
    private ortho2DGeneric(left: number, right: number, bottom: number, top: number, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm30 = (right + left) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        // perform optimized multiplication
        // compute the last column first, because other columns do not depend on it
        dest.m30 = this.m00 * rm30 + this.m10 * rm31 + this.m30;
        dest.m31 = this.m01 * rm30 + this.m11 * rm31 + this.m31;
        dest.m32 = this.m02 * rm30 + this.m12 * rm31 + this.m32;
        dest.m33 = this.m03 * rm30 + this.m13 * rm31 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m20 = -this.m20;
        dest.m21 = -this.m21;
        dest.m22 = -this.m22;
        dest.m23 = -this.m23;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Apply an orthographic projection transformation for a left-handed coordinate system to this matrix and store the result in <code>dest</code>.
     * <p>
     * This method is equivalent to calling {@link #orthoLH(double, double, double, double, double, double, Matrix4d) orthoLH()} with
     * <code>zNear=-1</code> and <code>zFar=+1</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the orthographic projection matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * orthographic projection transformation will be applied first!
     * <p>
     * In order to set the matrix to an orthographic projection without post-multiplying it,
     * use {@link #setOrtho2DLH(double, double, double, double) setOrthoLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #orthoLH(double, double, double, double, double, double, Matrix4d)
     * @see #setOrtho2DLH(double, double, double, double)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @param dest
     *            will hold the result
     * @return dest
     */
    public ortho2DLH(left: number, right: number, bottom: number, top: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        if (this.PROPERTY_IDENTITY)
            return dest.setOrtho2DLH(left, right, bottom, top);
        return this.ortho2DLHGeneric(left, right, bottom, top, dest);
    }
    private ortho2DLHGeneric(left: number, right: number, bottom: number, top: number, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = 2.0 / (right - left);
        const rm11 = 2.0 / (top - bottom);
        const rm30 = (right + left) / (left - right);
        const rm31 = (top + bottom) / (bottom - top);
        // perform optimized multiplication
        // compute the last column first, because other columns do not depend on it
        dest.m30 = this.m00 * rm30 + this.m10 * rm31 + this.m30;
        dest.m31 = this.m01 * rm30 + this.m11 * rm31 + this.m31;
        dest.m32 = this.m02 * rm30 + this.m12 * rm31 + this.m32;
        dest.m33 = this.m03 * rm30 + this.m13 * rm31 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m20 = this.m20;
        dest.m21 = this.m21;
        dest.m22 = this.m22;
        dest.m23 = this.m23;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Set this matrix to be an orthographic projection transformation for a right-handed coordinate system.
     * <p>
     * This method is equivalent to calling {@link #setOrtho(double, double, double, double, double, double) setOrtho()} with
     * <code>zNear=-1</code> and <code>zFar=+1</code>.
     * <p>
     * In order to apply the orthographic projection to an already existing transformation,
     * use {@link #ortho2D(double, double, double, double) ortho2D()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrtho(double, double, double, double, double, double)
     * @see #ortho2D(double, double, double, double)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @return this
     */
    public setOrtho2D(left: number, right: number, bottom: number, top: number): Matrix4 {
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = 2.0 / (right - left);
        this.m11 = 2.0 / (top - bottom);
        this.m22 = -1.0;
        this.m30 = (right + left) / (left - right);
        this.m31 = (top + bottom) / (bottom - top);
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Set this matrix to be an orthographic projection transformation for a left-handed coordinate system.
     * <p>
     * This method is equivalent to calling {@link #setOrtho(double, double, double, double, double, double) setOrthoLH()} with
     * <code>zNear=-1</code> and <code>zFar=+1</code>.
     * <p>
     * In order to apply the orthographic projection to an already existing transformation,
     * use {@link #ortho2DLH(double, double, double, double) ortho2DLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#ortho">http://www.songho.ca</a>
     * 
     * @see #setOrthoLH(double, double, double, double, double, double)
     * @see #ortho2DLH(double, double, double, double)
     * 
     * @param left
     *            the distance from the center to the left frustum edge
     * @param right
     *            the distance from the center to the right frustum edge
     * @param bottom
     *            the distance from the center to the bottom frustum edge
     * @param top
     *            the distance from the center to the top frustum edge
     * @return this
     */
    public setOrtho2DLH(left: number, right: number, bottom: number, top: number): Matrix4 {
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = 2.0 / (right - left);
        this.m11 = 2.0 / (top - bottom);
        this.m30 = (right + left) / (left - right);
        this.m31 = (top + bottom) / (bottom - top);
        // properties = PROPERTY_AFFINE;
        return this;
    }

    /**
     * Apply a rotation transformation to this matrix to make <code>-z</code> point along <code>dir</code>
     * and store the result in <code>dest</code>. 
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookalong rotation matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>, the
     * lookalong rotation transformation will be applied first!
     * <p>
     * This is equivalent to calling
     * {@link #lookAt(Vector3dc, Vector3dc, Vector3dc) lookAt}
     * with <code>eye = (0, 0, 0)</code> and <code>center = dir</code>.
     * <p>
     * In order to set the matrix to a lookalong transformation without post-multiplying it,
     * use {@link #setLookAlong(Vector3dc, Vector3dc) setLookAlong()}.
     * 
     * @see #lookAlong(double, double, double, double, double, double)
     * @see #lookAt(Vector3dc, Vector3dc, Vector3dc)
     * @see #setLookAlong(Vector3dc, Vector3dc)
     * 
     * @param dir
     *            the direction in space to look along
     * @param up
     *            the direction of 'up'
     * @param dest
     *            will hold the result
     * @return dest
     */
    public lookAlong(dir: Vector3, up: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply a rotation transformation to this matrix to make <code>-z</code> point along <code>dir</code>
     * and store the result in <code>dest</code>. 
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookalong rotation matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>, the
     * lookalong rotation transformation will be applied first!
     * <p>
     * This is equivalent to calling
     * {@link #lookAt(double, double, double, double, double, double, double, double, double) lookAt()}
     * with <code>eye = (0, 0, 0)</code> and <code>center = dir</code>.
     * <p>
     * In order to set the matrix to a lookalong transformation without post-multiplying it,
     * use {@link #setLookAlong(double, double, double, double, double, double) setLookAlong()}
     * 
     * @see #lookAt(double, double, double, double, double, double, double, double, double)
     * @see #setLookAlong(double, double, double, double, double, double)
     * 
     * @param dirX
     *              the x-coordinate of the direction to look along
     * @param dirY
     *              the y-coordinate of the direction to look along
     * @param dirZ
     *              the z-coordinate of the direction to look along
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @param dest
     *              will hold the result
     * @return dest
     */
    public lookAlong(dirX: number, dirY: number, dirZ: number, upX: number, upY: number, upZ: number, dest?: Matrix4): Matrix4;
    public lookAlong(dirX: number | Vector3, dirY: number | Vector3, dirZ?: number | Matrix4, upX?: number, upY?: number, upZ?: number, dest?: Matrix4): Matrix4 {

        dest = dest ?? (dirZ instanceof Matrix4 ? dirZ : this);
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        } else {
            dirY = dirY as number;
            dirZ = dirZ as number;
        }


        if (this.PROPERTY_IDENTITY)
            return dest.setLookAlong(dirX, dirY, dirZ, upX, upY, upZ);
        return this.lookAlongGeneric(dirX, dirY, dirZ, upX, upY, upZ, dest);
    }

    private lookAlongGeneric(dirX: number, dirY: number, dirZ: number, upX: number, upY: number, upZ: number, dest: Matrix4): Matrix4 {
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= -invDirLength;
        dirY *= -invDirLength;
        dirZ *= -invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        // calculate right matrix elements
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        // perform optimized matrix multiplication
        // introduce temporaries for dependent results
        const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02;
        const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02;
        const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02;
        const nm03 = this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02;
        const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12;
        const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12;
        const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12;
        const nm13 = this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12;
        dest.m20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22;
        dest.m21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22;
        dest.m22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22;
        dest.m23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22;
        // set the rest of the matrix elements
        dest.m00 = nm00;
        dest.m01 = nm01;
        dest.m02 = nm02;
        dest.m03 = nm03;
        dest.m10 = nm10;
        dest.m11 = nm11;
        dest.m12 = nm12;
        dest.m13 = nm13;
        dest.m30 = this.m30;
        dest.m31 = this.m31;
        dest.m32 = this.m32;
        dest.m33 = this.m33;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        return dest;
    }

    /**
     * Set this matrix to a rotation transformation to make <code>-z</code>
     * point along <code>dir</code>.
     * <p>
     * This is equivalent to calling
     * {@link #setLookAt(Vector3dc, Vector3dc, Vector3dc) setLookAt()} 
     * with <code>eye = (0, 0, 0)</code> and <code>center = dir</code>.
     * <p>
     * In order to apply the lookalong transformation to any previous existing transformation,
     * use {@link #lookAlong(Vector3dc, Vector3dc)}.
     * 
     * @see #setLookAlong(Vector3dc, Vector3dc)
     * @see #lookAlong(Vector3dc, Vector3dc)
     * 
     * @param dir
     *            the direction in space to look along
     * @param up
     *            the direction of 'up'
     * @return this
     */
    public setLookAlong(dir: Vector3, up: Vector3): Matrix4;

    /**
     * Set this matrix to a rotation transformation to make <code>-z</code>
     * point along <code>dir</code>.
     * <p>
     * This is equivalent to calling
     * {@link #setLookAt(double, double, double, double, double, double, double, double, double)
     * setLookAt()} with <code>eye = (0, 0, 0)</code> and <code>center = dir</code>.
     * <p>
     * In order to apply the lookalong transformation to any previous existing transformation,
     * use {@link #lookAlong(double, double, double, double, double, double) lookAlong()}
     * 
     * @see #setLookAlong(double, double, double, double, double, double)
     * @see #lookAlong(double, double, double, double, double, double)
     * 
     * @param dirX
     *              the x-coordinate of the direction to look along
     * @param dirY
     *              the y-coordinate of the direction to look along
     * @param dirZ
     *              the z-coordinate of the direction to look along
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @return this
     */
    public setLookAlong(dirX: number, dirY: number, dirZ: number,
        upX: number, upY: number, upZ: number): Matrix4;
    public setLookAlong(dirX: number | Vector3, dirY: number | Vector3, dirZ?: number,
        upX?: number, upY?: number, upZ?: number): Matrix4 {
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        } else {
            dirY = dirY as number;
            dirX = dirX as number;
        }


        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= -invDirLength;
        dirY *= -invDirLength;
        dirZ *= -invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        this.m00 = leftX;
        this.m01 = upnX;
        this.m02 = dirX;
        this.m03 = 0.0;
        this.m10 = leftY;
        this.m11 = upnY;
        this.m12 = dirY;
        this.m13 = 0.0;
        this.m20 = leftZ;
        this.m21 = upnZ;
        this.m22 = dirZ;
        this.m23 = 0.0;
        this.m30 = 0.0;
        this.m31 = 0.0;
        this.m32 = 0.0;
        this.m33 = 1.0;
        // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
        return this;
    }

    /**
     * Set this matrix to be a "lookat" transformation for a right-handed coordinate system, that aligns
     * <code>-z</code> with <code>center - eye</code>.
     * <p>
     * In order to not make use of vectors to specify <code>eye</code>, <code>center</code> and <code>up</code> but use primitives,
     * like in the GLU function, use {@link #setLookAt(double, double, double, double, double, double, double, double, double) setLookAt()}
     * instead.
     * <p>
     * In order to apply the lookat transformation to a previous existing transformation,
     * use {@link #lookAt(Vector3dc, Vector3dc, Vector3dc) lookAt()}.
     * 
     * @see #setLookAt(double, double, double, double, double, double, double, double, double)
     * @see #lookAt(Vector3dc, Vector3dc, Vector3dc)
     * 
     * @param eye
     *            the position of the camera
     * @param center
     *            the point in space to look at
     * @param up
     *            the direction of 'up'
     * @return this
     */
    public setLookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4;

    /**
     * Set this matrix to be a "lookat" transformation for a right-handed coordinate system, 
     * that aligns <code>-z</code> with <code>center - eye</code>.
     * <p>
     * In order to apply the lookat transformation to a previous existing transformation,
     * use {@link #lookAt(double, double, double, double, double, double, double, double, double) lookAt}.
     * 
     * @see #setLookAt(Vector3dc, Vector3dc, Vector3dc)
     * @see #lookAt(double, double, double, double, double, double, double, double, double)
     * 
     * @param eyeX
     *              the x-coordinate of the eye/camera location
     * @param eyeY
     *              the y-coordinate of the eye/camera location
     * @param eyeZ
     *              the z-coordinate of the eye/camera location
     * @param centerX
     *              the x-coordinate of the point to look at
     * @param centerY
     *              the y-coordinate of the point to look at
     * @param centerZ
     *              the z-coordinate of the point to look at
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @return this
     */
    public setLookAt(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number): Matrix4;
    public setLookAt(eyeX: number | Vector3, eyeY: number | Vector3, eyeZ: number | Vector3,
        centerX?: number, centerY?: number, centerZ?: number,
        upX?: number, upY?: number, upZ?: number): Matrix4 {

        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        } else {
            eyeX = eyeX as number;
            eyeY = eyeY as number;
            eyeZ = eyeZ as number;
        }
        // Compute direction from position to lookAt
        let dirX, dirY, dirZ;
        dirX = eyeX - centerX;
        dirY = eyeY - centerY;
        dirZ = eyeZ - centerZ;
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        let invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        this.m00 = leftX;
        this.m01 = upnX;
        this.m02 = dirX;
        this.m03 = 0.0;
        this.m10 = leftY;
        this.m11 = upnY;
        this.m12 = dirY;
        this.m13 = 0.0;
        this.m20 = leftZ;
        this.m21 = upnZ;
        this.m22 = dirZ;
        this.m23 = 0.0;
        this.m30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        this.m31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        this.m32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        this.m33 = 1.0;
        return this;
        // _properties(PROPERTY_AFFINE | PROPERTY_ORTHONORMAL);
    }

    /**
     * Apply a "lookat" transformation to this matrix for a right-handed coordinate system, 
     * that aligns <code>-z</code> with <code>center - eye</code> and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a lookat transformation without post-multiplying it,
     * use {@link #setLookAt(Vector3dc, Vector3dc, Vector3dc)}.
     * 
     * @see #lookAt(double, double, double, double, double, double, double, double, double)
     * @see #setLookAlong(Vector3dc, Vector3dc)
     * 
     * @param eye
     *            the position of the camera
     * @param center
     *            the point in space to look at
     * @param up
     *            the direction of 'up'
     * @param dest
     *            will hold the result
     * @return dest
     */
    public lookAt(eye: Vector3, center: Vector3, up: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply a "lookat" transformation to this matrix for a right-handed coordinate system, 
     * that aligns <code>-z</code> with <code>center - eye</code> and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a lookat transformation without post-multiplying it,
     * use {@link #setLookAt(double, double, double, double, double, double, double, double, double) setLookAt()}.
     * 
     * @see #lookAt(Vector3dc, Vector3dc, Vector3dc)
     * @see #setLookAt(double, double, double, double, double, double, double, double, double)
     * 
     * @param eyeX
     *              the x-coordinate of the eye/camera location
     * @param eyeY
     *              the y-coordinate of the eye/camera location
     * @param eyeZ
     *              the z-coordinate of the eye/camera location
     * @param centerX
     *              the x-coordinate of the point to look at
     * @param centerY
     *              the y-coordinate of the point to look at
     * @param centerZ
     *              the z-coordinate of the point to look at
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @param dest
     *          will hold the result
     * @return dest
     */
    public lookAt(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number, dest?: Matrix4): Matrix4
    public lookAt(eyeX: number | Vector3, eyeY: number | Vector3, eyeZ: number | Vector3,
        centerX?: number | Matrix4, centerY?: number, centerZ?: number,
        upX?: number, upY?: number, upZ?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (centerX instanceof Matrix4 ? centerX : this);
        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        } else {
            centerX = centerX as number;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        } else {
            eyeY = eyeY as number;
            eyeZ = eyeZ as number;
        }

        if (this.PROPERTY_IDENTITY)
            return dest.setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        else if (this.PROPERTY_PERSPECTIVE)
            return this.lookAtPerspective(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest);

        // Compute direction from position to lookAt
        let dirX, dirY, dirZ;
        dirX = eyeX - centerX;
        dirY = eyeY - centerY;
        dirZ = eyeZ - centerZ;
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        // calculate right matrix elements
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        return dest.set(
            this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02,
            this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02,
            this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02,
            this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02,
            this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12,
            this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12,
            this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12,
            this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12,
            this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22,
            this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22,
            this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22,
            this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22,
            this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30,
            this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31,
            this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32,
            this.m03 * rm30 + this.m13 * rm31 + this.m23 * rm32 + this.m33,
        )
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply a "lookat" transformation to this matrix for a right-handed coordinate system, 
     * that aligns <code>-z</code> with <code>center - eye</code> and store the result in <code>dest</code>.
     * <p>
     * This method assumes <code>this</code> to be a perspective transformation, obtained via
     * {@link #frustum(double, double, double, double, double, double) frustum()} or {@link #perspective(double, double, double, double) perspective()} or
     * one of their overloads.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a lookat transformation without post-multiplying it,
     * use {@link #setLookAt(double, double, double, double, double, double, double, double, double) setLookAt()}.
     * 
     * @see #setLookAt(double, double, double, double, double, double, double, double, double)
     * 
     * @param eyeX
     *              the x-coordinate of the eye/camera location
     * @param eyeY
     *              the y-coordinate of the eye/camera location
     * @param eyeZ
     *              the z-coordinate of the eye/camera location
     * @param centerX
     *              the x-coordinate of the point to look at
     * @param centerY
     *              the y-coordinate of the point to look at
     * @param centerZ
     *              the z-coordinate of the point to look at
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @param dest
     *          will hold the result
     * @return dest
     */
    public lookAtPerspective(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number, dest: Matrix4): Matrix4 {
        // Compute direction from position to lookAt
        let dirX, dirY, dirZ;
        dirX = eyeX - centerX;
        dirY = eyeY - centerY;
        dirZ = eyeZ - centerZ;
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        const nm10 = this.m00 * leftY;
        const nm20 = this.m00 * leftZ;
        const nm21 = this.m11 * upnZ;
        const nm30 = this.m00 * rm30;
        const nm31 = this.m11 * rm31;
        const nm32 = this.m22 * rm32 + this.m32;
        const nm33 = this.m23 * rm32;

        dest.m00 = this.m00 * leftX;
        dest.m01 = this.m11 * upnX;
        dest.m02 = this.m22 * dirX;
        dest.m03 = this.m23 * dirX;
        dest.m10 = nm10;
        dest.m11 = this.m11 * upnY;
        dest.m12 = this.m22 * dirY;
        dest.m13 = this.m23 * dirY;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = this.m22 * dirZ;
        dest.m23 = this.m23 * dirZ;
        dest.m30 = nm30;
        dest.m31 = nm31;
        dest.m32 = nm32;
        dest.m33 = nm33;
        // ._properties(0);
        return dest;
    }

    /**
     * Set this matrix to be a "lookat" transformation for a left-handed coordinate system, that aligns
     * <code>+z</code> with <code>center - eye</code>.
     * <p>
     * In order to not make use of vectors to specify <code>eye</code>, <code>center</code> and <code>up</code> but use primitives,
     * like in the GLU function, use {@link #setLookAtLH(double, double, double, double, double, double, double, double, double) setLookAtLH()}
     * instead.
     * <p>
     * In order to apply the lookat transformation to a previous existing transformation,
     * use {@link #lookAtLH(Vector3dc, Vector3dc, Vector3dc) lookAt()}.
     * 
     * @see #setLookAtLH(double, double, double, double, double, double, double, double, double)
     * @see #lookAtLH(Vector3dc, Vector3dc, Vector3dc)
     * 
     * @param eye
     *            the position of the camera
     * @param center
     *            the point in space to look at
     * @param up
     *            the direction of 'up'
     * @return this
     */
    public setLookAtLH(eye: Vector3, center: Vector3, up: Vector3): Matrix4;

    /**
     * Set this matrix to be a "lookat" transformation for a left-handed coordinate system, 
     * that aligns <code>+z</code> with <code>center - eye</code>.
     * <p>
     * In order to apply the lookat transformation to a previous existing transformation,
     * use {@link #lookAtLH(double, double, double, double, double, double, double, double, double) lookAtLH}.
     * 
     * @see #setLookAtLH(Vector3dc, Vector3dc, Vector3dc)
     * @see #lookAtLH(double, double, double, double, double, double, double, double, double)
     * 
     * @param eyeX
     *              the x-coordinate of the eye/camera location
     * @param eyeY
     *              the y-coordinate of the eye/camera location
     * @param eyeZ
     *              the z-coordinate of the eye/camera location
     * @param centerX
     *              the x-coordinate of the point to look at
     * @param centerY
     *              the y-coordinate of the point to look at
     * @param centerZ
     *              the z-coordinate of the point to look at
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @return this
     */
    public setLookAtLH(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number): Matrix4;
    public setLookAtLH(eyeX: number | Vector3, eyeY: number | Vector3, eyeZ: number | Vector3,
        centerX?: number, centerY?: number, centerZ?: number,
        upX?: number, upY?: number, upZ?: number): Matrix4 {

        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        } else {
            centerX = centerX as number;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        } else {
            eyeY = eyeY as number;
            eyeZ = eyeZ as number;
        }
        // Compute direction from position to lookAt
        let dirX, dirY, dirZ;
        dirX = centerX - eyeX;
        dirY = centerY - eyeY;
        dirZ = centerZ - eyeZ;
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        this.m00 = leftX;
        this.m01 = upnX;
        this.m02 = dirX;
        this.m03 = 0.0;
        this.m10 = leftY;
        this.m11 = upnY;
        this.m12 = dirY;
        this.m13 = 0.0;
        this.m20 = leftZ;
        this.m21 = upnZ;
        this.m22 = dirZ;
        this.m23 = 0.0;
        this.m30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        this.m31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        this.m32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        this.m33 = 1.0;
        // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
        return this;
    }

    /**
     * Apply a "lookat" transformation to this matrix for a left-handed coordinate system, 
     * that aligns <code>+z</code> with <code>center - eye</code> and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a lookat transformation without post-multiplying it,
     * use {@link #setLookAtLH(Vector3dc, Vector3dc, Vector3dc)}.
     * 
     * @see #lookAtLH(double, double, double, double, double, double, double, double, double)
     * @see #setLookAtLH(Vector3dc, Vector3dc, Vector3dc)
     * 
     * @param eye
     *            the position of the camera
     * @param center
     *            the point in space to look at
     * @param up
     *            the direction of 'up'
     * @param dest
     *            will hold the result
     * @return dest
     */
    public lookAtLH(eye: Vector3, center: Vector3, up: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply a "lookat" transformation to this matrix for a left-handed coordinate system, 
     * that aligns <code>+z</code> with <code>center - eye</code> and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a lookat transformation without post-multiplying it,
     * use {@link #setLookAtLH(double, double, double, double, double, double, double, double, double) setLookAtLH()}.
     * 
     * @see #lookAtLH(Vector3dc, Vector3dc, Vector3dc)
     * @see #setLookAtLH(double, double, double, double, double, double, double, double, double)
     * 
     * @param eyeX
     *              the x-coordinate of the eye/camera location
     * @param eyeY
     *              the y-coordinate of the eye/camera location
     * @param eyeZ
     *              the z-coordinate of the eye/camera location
     * @param centerX
     *              the x-coordinate of the point to look at
     * @param centerY
     *              the y-coordinate of the point to look at
     * @param centerZ
     *              the z-coordinate of the point to look at
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @param dest
     *          will hold the result
     * @return dest
     */
    public lookAtLH(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number, dest?: Matrix4): Matrix4;
    public lookAtLH(eyeX: number | Vector3, eyeY: number | Vector3, eyeZ: number | Vector3,
        centerX?: number | Matrix4, centerY?: number, centerZ?: number,
        upX?: number, upY?: number, upZ?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (centerX instanceof Matrix4 ? centerX : this);
        if (eyeZ instanceof Vector3) {
            upZ = eyeZ.z, upY = eyeZ.y, upX = eyeZ.x;
        }
        if (eyeY instanceof Vector3) {
            centerZ = eyeY.z, centerY = eyeY.y, centerX = eyeY.x;
        } else {
            centerX = centerX as number;
        }
        if (eyeX instanceof Vector3) {
            eyeZ = eyeX.z, eyeY = eyeX.y, eyeX = eyeX.x;
        } else {
            eyeY = eyeY as number;
            eyeZ = eyeZ as number;
        }

        if (this.PROPERTY_IDENTITY)
            return dest.setLookAtLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);
        else if (this.PROPERTY_PERSPECTIVE)
            return this.lookAtPerspectiveLH(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest);
        return this.lookAtLHGeneric(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ, dest);
    }
    private lookAtLHGeneric(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number, dest: Matrix4): Matrix4 {
        // Compute direction from position to lookAt
        let dirX, dirY, dirZ;
        dirX = centerX - eyeX;
        dirY = centerY - eyeY;
        dirZ = centerZ - eyeZ;
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;
        // calculate right matrix elements
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);
        // introduce temporaries for dependent results
        return dest.set(
            this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02,
            this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02,
            this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02,
            this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02,
            this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12,
            this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12,
            this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12,
            this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12,
            this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22,
            this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22,
            this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22,
            this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22,
            this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30,
            this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31,
            this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32,
            this.m03 * rm30 + this.m13 * rm31 + this.m23 * rm32 + this.m33,
        )
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        // return dest;
    }

    /**
     * Apply a "lookat" transformation to this matrix for a left-handed coordinate system, 
     * that aligns <code>+z</code> with <code>center - eye</code> and store the result in <code>dest</code>.
     * <p>
     * This method assumes <code>this</code> to be a perspective transformation, obtained via
     * {@link #frustumLH(double, double, double, double, double, double) frustumLH()} or {@link #perspectiveLH(double, double, double, double) perspectiveLH()} or
     * one of their overloads.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a lookat transformation without post-multiplying it,
     * use {@link #setLookAtLH(double, double, double, double, double, double, double, double, double) setLookAtLH()}.
     * 
     * @see #setLookAtLH(double, double, double, double, double, double, double, double, double)
     * 
     * @param eyeX
     *              the x-coordinate of the eye/camera location
     * @param eyeY
     *              the y-coordinate of the eye/camera location
     * @param eyeZ
     *              the z-coordinate of the eye/camera location
     * @param centerX
     *              the x-coordinate of the point to look at
     * @param centerY
     *              the y-coordinate of the point to look at
     * @param centerZ
     *              the z-coordinate of the point to look at
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @param dest
     *          will hold the result
     * @return dest
     */
    public lookAtPerspectiveLH(eyeX: number, eyeY: number, eyeZ: number,
        centerX: number, centerY: number, centerZ: number,
        upX: number, upY: number, upZ: number, dest: Matrix4): Matrix4 {
        // Compute direction from position to lookAt
        let dirX, dirY, dirZ;
        dirX = centerX - eyeX;
        dirY = centerY - eyeY;
        dirZ = centerZ - eyeZ;
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLength;
        dirY *= invDirLength;
        dirZ *= invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * dirZ - upZ * dirY;
        leftY = upZ * dirX - upX * dirZ;
        leftZ = upX * dirY - upY * dirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = dirY * leftZ - dirZ * leftY;
        const upnY = dirZ * leftX - dirX * leftZ;
        const upnZ = dirX * leftY - dirY * leftX;

        // calculate right matrix elements
        const rm00 = leftX;
        const rm01 = upnX;
        const rm02 = dirX;
        const rm10 = leftY;
        const rm11 = upnY;
        const rm12 = dirY;
        const rm20 = leftZ;
        const rm21 = upnZ;
        const rm22 = dirZ;
        const rm30 = -(leftX * eyeX + leftY * eyeY + leftZ * eyeZ);
        const rm31 = -(upnX * eyeX + upnY * eyeY + upnZ * eyeZ);
        const rm32 = -(dirX * eyeX + dirY * eyeY + dirZ * eyeZ);

        return dest.set(
            this.m00 * rm00,
            this.m11 * rm01,
            this.m22 * rm02,
            this.m23 * rm02,
            this.m00 * rm10,
            this.m11 * rm11,
            this.m22 * rm12,
            this.m23 * rm12,
            this.m00 * rm20,
            this.m11 * rm21,
            this.m22 * rm22,
            this.m23 * rm22,
            this.m00 * rm30,
            this.m11 * rm31,
            this.m22 * rm32 + this.m32,
            this.m23 * rm32,
        );
        // ._properties(0);

        // return dest;
    }

    /**
     * This method is equivalent to calling: <code>translate(w-1-2*x, h-1-2*y, 0).scale(w, h, 1)</code>
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>T</code> the created transformation matrix,
     * then the new matrix will be <code>M * T</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * T * v</code>, the
     * created transformation will be applied first!
     * 
     * @param x
     *             the tile's x coordinate/index (should be in <code>[0..w)</code>)
     * @param y
     *             the tile's y coordinate/index (should be in <code>[0..h)</code>)
     * @param w
     *             the number of tiles along the x axis
     * @param h
     *             the number of tiles along the y axis
     * @return this
     */
    public tile(x: number, y: number, w: number, h: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const tx = w - 1 - (x << 1), ty = h - 1 - (y << 1);
        // return dest
        dest.m30 = this.m00 * tx + this.m10 * ty + this.m30;
        dest.m31 = this.m01 * tx + this.m11 * ty + this.m31;
        dest.m32 = this.m02 * tx + this.m12 * ty + this.m32;
        dest.m33 = this.m03 * tx + this.m13 * ty + this.m33;
        dest.m00 = this.m00 * w;
        dest.m01 = this.m01 * w;
        dest.m02 = this.m02 * w;
        dest.m03 = this.m03 * w;
        dest.m10 = this.m10 * h;
        dest.m11 = this.m11 * h;
        dest.m12 = this.m12 * h;
        dest.m13 = this.m13 * h;
        dest.m20 = this.m20;
        dest.m21 = this.m21;
        dest.m22 = this.m22;
        dest.m23 = this.m23;
        return dest;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
    }


    /**
     * Apply a symmetric perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>P</code> the perspective projection matrix,
     * then the new matrix will be <code>M * P</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * P * v</code>,
     * the perspective projection will be applied first!
     * <p>
     * In order to set the matrix to a perspective frustum transformation without post-multiplying,
     * use {@link #setPerspective(double, double, double, double, boolean) setPerspective}.
     * 
     * @see #setPerspective(double, double, double, double, boolean)
     * 
     * @param fovy
     *            the vertical field of view in radians (must be greater than zero and less than {@link Math#PI PI})
     * @param aspect
     *            the aspect ratio (i.e. width / height; must be greater than zero)
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param dest
     *            will hold the result
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return dest
     */
    public perspective(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public perspective(fovy: number, aspect: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    public perspective(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setPerspective(fovy, aspect, zNear, zFar, zZeroToOne);
        return this.perspectiveGeneric(fovy, aspect, zNear, zFar, zZeroToOne, dest);
    }
    private perspectiveGeneric(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        const h = Math.tan(fovy * 0.5);
        // calculate right matrix elements
        const rm00 = 1.0 / (h * aspect);
        const rm11 = 1.0 / h;
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        } else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        } else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        // perform optimized matrix multiplication
        const nm20 = this.m20 * rm22 - this.m30;
        const nm21 = this.m21 * rm22 - this.m31;
        const nm22 = this.m22 * rm22 - this.m32;
        const nm23 = this.m23 * rm22 - this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m30 = this.m20 * rm32;
        dest.m31 = this.m21 * rm32;
        dest.m32 = this.m22 * rm32;
        dest.m33 = this.m23 * rm32;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        // ._properties(properties & ~(PROPERTY_AFFINE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Apply a symmetric perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>P</code> the perspective projection matrix,
     * then the new matrix will be <code>M * P</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * P * v</code>,
     * the perspective projection will be applied first!
     * <p>
     * In order to set the matrix to a perspective frustum transformation without post-multiplying,
     * use {@link #setPerspectiveRect(double, double, double, double, boolean) setPerspectiveRect}.
     * 
     * @see #setPerspectiveRect(double, double, double, double, boolean)
     * 
     * @param width
     *            the width of the near frustum plane
     * @param height
     *            the height of the near frustum plane
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param dest
     *            will hold the result
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return dest
     */
    public perspectiveRect(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public perspectiveRect(width: number, height: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    public perspectiveRect(width: number, height: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setPerspectiveRect(width, height, zNear, zFar, zZeroToOne);
        return this.perspectiveRectGeneric(width, height, zNear, zFar, zZeroToOne, dest);
    }
    private perspectiveRectGeneric(width: number, height: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        const rm00 = (zNear + zNear) / width;
        const rm11 = (zNear + zNear) / height;
        let rm22, rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        } else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        } else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        // perform optimized matrix multiplication
        const nm20 = this.m20 * rm22 - this.m30;
        const nm21 = this.m21 * rm22 - this.m31;
        const nm22 = this.m22 * rm22 - this.m32;
        const nm23 = this.m23 * rm22 - this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m30 = this.m20 * rm32;
        dest.m31 = this.m21 * rm32;
        dest.m32 = this.m22 * rm32;
        dest.m33 = this.m23 * rm32;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        // ._properties(properties & ~(PROPERTY_AFFINE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Apply an asymmetric off-center perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * The given angles <code>offAngleX</code> and <code>offAngleY</code> are the horizontal and vertical angles between
     * the line of sight and the line given by the center of the near and far frustum planes. So, when <code>offAngleY</code>
     * is just <code>fovy/2</code> then the projection frustum is rotated towards +Y and the bottom frustum plane 
     * is parallel to the XZ-plane.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>P</code> the perspective projection matrix,
     * then the new matrix will be <code>M * P</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * P * v</code>,
     * the perspective projection will be applied first!
     * <p>
     * In order to set the matrix to a perspective frustum transformation without post-multiplying,
     * use {@link #setPerspectiveOffCenter(double, double, double, double, double, double, boolean) setPerspectiveOffCenter}.
     * 
     * @see #setPerspectiveOffCenter(double, double, double, double, double, double, boolean)
     * 
     * @param fovy
     *            the vertical field of view in radians (must be greater than zero and less than {@link Math#PI PI})
     * @param offAngleX
     *            the horizontal angle between the line of sight and the line crossing the center of the near and far frustum planes
     * @param offAngleY
     *            the vertical angle between the line of sight and the line crossing the center of the near and far frustum planes
     * @param aspect
     *            the aspect ratio (i.e. width / height; must be greater than zero)
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param dest
     *            will hold the result
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return dest
     */
    public perspectiveOffCenter(fovy: number, offAngleX: number, offAngleY: number, aspect: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public perspectiveOffCenter(fovy: number, offAngleX: number, offAngleY: number, aspect: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    public perspectiveOffCenter(fovy: number, offAngleX: number, offAngleY: number, aspect: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setPerspectiveOffCenter(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne);
        return this.perspectiveOffCenterGeneric(fovy, offAngleX, offAngleY, aspect, zNear, zFar, zZeroToOne, dest);
    }
    private perspectiveOffCenterGeneric(fovy: number, offAngleX: number, offAngleY: number, aspect: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        const h = Math.tan(fovy * 0.5);
        // calculate right matrix elements
        const xScale = 1.0 / (h * aspect);
        const yScale = 1.0 / h;
        const rm00 = xScale;
        const rm11 = yScale;
        const offX = Math.tan(offAngleX), offY = Math.tan(offAngleY);
        const rm20 = offX * xScale;
        const rm21 = offY * yScale;
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        } else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        } else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        // perform optimized matrix multiplication
        const nm20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22 - this.m30;
        const nm21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22 - this.m31;
        const nm22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22 - this.m32;
        const nm23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22 - this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m30 = this.m20 * rm32;
        dest.m31 = this.m21 * rm32;
        dest.m32 = this.m22 * rm32;
        dest.m33 = this.m23 * rm32;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        // ._properties(properties & ~(PROPERTY_AFFINE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION
        //     | PROPERTY_ORTHONORMAL | (rm20 == 0.0 && rm21 == 0.0 ? 0 : PROPERTY_PERSPECTIVE)));
        return dest;
    }

    /**
     * Set this matrix to be a symmetric perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range.
     * <p>
     * In order to apply the perspective projection transformation to an existing transformation,
     * use {@link #perspective(double, double, double, double, boolean) perspective()}.
     * 
     * @see #perspective(double, double, double, double, boolean)
     * 
     * @param fovy
     *            the vertical field of view in radians (must be greater than zero and less than {@link Math#PI PI})
     * @param aspect
     *            the aspect ratio (i.e. width / height; must be greater than zero)
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setPerspective(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne?: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        const h = Math.tan(fovy * 0.5);
        this.m00 = 1 / (h * aspect);
        this.m01 = 0;
        this.m02 = 0;
        this.m03 = 0;
        this.m10 = 0;
        this.m11 = 1 / h;
        this.m12 = 0;
        this.m13 = 0;
        this.m20 = 0;
        this.m21 = 0;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            this.m22 = (e - 1.0);
            this.m32 = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        } else if (nearInf) {
            const e = 1E-6;
            this.m22 = ((zZeroToOne ? 0.0 : 1.0) - e);
            this.m32 = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        } else {
            this.m22 = ((zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar));
            this.m32 = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this.m23 = -1;
        this.m30 = 0;
        this.m31 = 0;
        this.m33 = 0;
        // properties = PROPERTY_PERSPECTIVE;
        return this;
    }

    /**
     * Set this matrix to be a symmetric perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range.
     * <p>
     * In order to apply the perspective projection transformation to an existing transformation,
     * use {@link #perspectiveRect(double, double, double, double, boolean) perspectiveRect()}.
     * 
     * @see #perspectiveRect(double, double, double, double, boolean)
     * 
     * @param width
     *            the width of the near frustum plane
     * @param height
     *            the height of the near frustum plane
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setPerspectiveRect(width: number, height: number, zNear: number, zFar: number, zZeroToOne?: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        this.zero();
        this.m00 = (zNear + zNear) / width;
        this.m11 = (zNear + zNear) / height;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            this.m22 = (e - 1.0);
            this.m32 = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        } else if (nearInf) {
            const e = 1E-6;
            this.m22 = ((zZeroToOne ? 0.0 : 1.0) - e);
            this.m32 = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        } else {
            this.m22 = ((zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar));
            this.m32 = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this.m23 = (-1.0);
        // properties = PROPERTY_PERSPECTIVE;
        return this;
    }

    /**
     * Set this matrix to be an asymmetric off-center perspective projection frustum transformation for a right-handed
     * coordinate system using the given NDC z range.
     * <p>
     * The given angles <code>offAngleX</code> and <code>offAngleY</code> are the horizontal and vertical angles between
     * the line of sight and the line given by the center of the near and far frustum planes. So, when <code>offAngleY</code>
     * is just <code>fovy/2</code> then the projection frustum is rotated towards +Y and the bottom frustum plane 
     * is parallel to the XZ-plane.
     * <p>
     * In order to apply the perspective projection transformation to an existing transformation,
     * use {@link #perspectiveOffCenter(double, double, double, double, double, double) perspectiveOffCenter()}.
     * 
     * @see #perspectiveOffCenter(double, double, double, double, double, double)
     * 
     * @param fovy
     *            the vertical field of view in radians (must be greater than zero and less than {@link Math#PI PI})
     * @param offAngleX
     *            the horizontal angle between the line of sight and the line crossing the center of the near and far frustum planes
     * @param offAngleY
     *            the vertical angle between the line of sight and the line crossing the center of the near and far frustum planes
     * @param aspect
     *            the aspect ratio (i.e. width / height; must be greater than zero)
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setPerspectiveOffCenter(fovy: number, offAngleX: number, offAngleY: number,
        aspect: number, zNear: number, zFar: number, zZeroToOne?: boolean) {
        zZeroToOne = zZeroToOne ?? false;
        this.zero();
        const h = Math.tan(fovy * 0.5);
        const xScale = 1.0 / (h * aspect), yScale = 1.0 / h;
        this.m00 = xScale;
        this.m11 = yScale;
        const offX = Math.tan(offAngleX), offY = Math.tan(offAngleY);
        this.m20 = offX * xScale;
        this.m21 = offY * yScale;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            this.m22 = (e - 1.0)
            this.m32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear
        } else if (nearInf) {
            const e = 1E-6;
            this.m22 = ((zZeroToOne ? 0.0 : 1.0) - e)
            this.m32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar
        } else {
            this.m22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar)
            this.m32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar)
        }
        this.m23 = -1;
        this.m30 = 0;
        this.m31 = 0;
        this.m33 = 0;
        // properties = offAngleX == 0.0 && offAngleY == 0.0 ? PROPERTY_PERSPECTIVE : 0;
        return this;
    }

    /**
     * Apply a symmetric perspective projection frustum transformation for a left-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>P</code> the perspective projection matrix,
     * then the new matrix will be <code>M * P</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * P * v</code>,
     * the perspective projection will be applied first!
     * <p>
     * In order to set the matrix to a perspective frustum transformation without post-multiplying,
     * use {@link #setPerspectiveLH(double, double, double, double, boolean) setPerspectiveLH}.
     * 
     * @see #setPerspectiveLH(double, double, double, double, boolean)
     * 
     * @param fovy
     *            the vertical field of view in radians (must be greater than zero and less than {@link Math#PI PI})
     * @param aspect
     *            the aspect ratio (i.e. width / height; must be greater than zero)
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @param dest
     *            will hold the result
     * @return dest
     */
    public perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    public perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setPerspectiveLH(fovy, aspect, zNear, zFar, zZeroToOne);
        return this.perspectiveLHGeneric(fovy, aspect, zNear, zFar, zZeroToOne, dest);
    }
    private perspectiveLHGeneric(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        const h = Math.tan(fovy * 0.5);
        // calculate right matrix elements
        const rm00 = 1.0 / (h * aspect);
        const rm11 = 1.0 / h;
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            rm22 = 1.0 - e;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        } else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        } else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        // perform optimized matrix multiplication
        const nm20 = this.m20 * rm22 + this.m30;
        const nm21 = this.m21 * rm22 + this.m31;
        const nm22 = this.m22 * rm22 + this.m32;
        const nm23 = this.m23 * rm22 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m30 = this.m20 * rm32;
        dest.m31 = this.m21 * rm32;
        dest.m32 = this.m22 * rm32;
        dest.m33 = this.m23 * rm32;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        // ._properties(properties & ~(PROPERTY_AFFINE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    /**
     * Set this matrix to be a symmetric perspective projection frustum transformation for a left-handed coordinate system
     * using the given NDC z range of <code>[-1..+1]</code>.
     * <p>
     * In order to apply the perspective projection transformation to an existing transformation,
     * use {@link #perspectiveLH(double, double, double, double, boolean) perspectiveLH()}.
     * 
     * @see #perspectiveLH(double, double, double, double, boolean)
     * 
     * @param fovy
     *            the vertical field of view in radians (must be greater than zero and less than {@link Math#PI PI})
     * @param aspect
     *            the aspect ratio (i.e. width / height; must be greater than zero)
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setPerspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number, zZeroToOne?: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        const h = Math.tan(fovy * 0.5);
        this.m00 = 1 / (h * aspect);
        this.m01 = 0;
        this.m02 = 0;
        this.m03 = 0;
        this.m10 = 0;
        this.m11 = 1 / h;
        this.m12 = 0;
        this.m13 = 0;
        this.m20 = 0;
        this.m21 = 0;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            this.m22 = (1.0 - e)
            this.m32 = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        } else if (nearInf) {
            const e = 1E-6;
            this.m22 = ((zZeroToOne ? 0.0 : 1.0) - e)
            this.m32 = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        } else {
            this.m22 = ((zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear))
            this.m32 = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this.m23 = (1.0)
        this.m30 = (0.0)
        this.m31 = (0.0)
        this.m33 = (0.0)
        // properties = PROPERTY_PERSPECTIVE;
        return this;
    }

    /**
     * Apply an arbitrary perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>F</code> the frustum matrix,
     * then the new matrix will be <code>M * F</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * F * v</code>,
     * the frustum transformation will be applied first!
     * <p>
     * In order to set the matrix to a perspective frustum transformation without post-multiplying,
     * use {@link #setFrustum(double, double, double, double, double, double, boolean) setFrustum()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#perspective">http://www.songho.ca</a>
     * 
     * @see #setFrustum(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance along the x-axis to the left frustum edge
     * @param right
     *            the distance along the x-axis to the right frustum edge
     * @param bottom
     *            the distance along the y-axis to the bottom frustum edge
     * @param top
     *            the distance along the y-axis to the top frustum edge
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @param dest
     *            will hold the result
     * @return dest
     */
    public frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4;
    public frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, dest?: Matrix4): Matrix4;
    public frustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setFrustum(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.frustumGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    private frustumGeneric(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = (zNear + zNear) / (right - left);
        const rm11 = (zNear + zNear) / (top - bottom);
        const rm20 = (right + left) / (right - left);
        const rm21 = (top + bottom) / (top - bottom);
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            rm22 = e - 1.0;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        } else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        } else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        // perform optimized matrix multiplication
        const nm20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22 - this.m30;
        const nm21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22 - this.m31;
        const nm22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22 - this.m32;
        const nm23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22 - this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m30 = this.m20 * rm32;
        dest.m31 = this.m21 * rm32;
        dest.m32 = this.m22 * rm32;
        dest.m33 = this.m23 * rm32;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        // ._properties(0);
        return dest;
    }

    /**
     * Set this matrix to be an arbitrary perspective projection frustum transformation for a right-handed coordinate system
     * using the given NDC z range.
     * <p>
     * In order to apply the perspective frustum transformation to an existing transformation,
     * use {@link #frustum(double, double, double, double, double, double, boolean) frustum()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#perspective">http://www.songho.ca</a>
     * 
     * @see #frustum(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance along the x-axis to the left frustum edge
     * @param right
     *            the distance along the x-axis to the right frustum edge
     * @param bottom
     *            the distance along the y-axis to the bottom frustum edge
     * @param top
     *            the distance along the y-axis to the top frustum edge
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setFrustum(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = (zNear + zNear) / (right - left);
        this.m11 = (zNear + zNear) / (top - bottom);
        this.m20 = (right + left) / (right - left);
        this.m21 = (top + bottom) / (top - bottom);
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            this.m22 = (e - 1.0);
            this.m32 = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        } else if (nearInf) {
            const e = 1E-6;
            this.m22 = ((zZeroToOne ? 0.0 : 1.0) - e);
            this.m32 = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        } else {
            this.m22 = ((zZeroToOne ? zFar : zFar + zNear) / (zNear - zFar));
            this.m32 = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this.m23 = (-1.0)
        this.m33 = (0.0)
        // properties = this.m20 == 0.0 && this.m21 == 0.0 ? PROPERTY_PERSPECTIVE : 0;
        return this;
    }

    /**
     * Apply an arbitrary perspective projection frustum transformation for a left-handed coordinate system
     * using the given NDC z range to this matrix and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>F</code> the frustum matrix,
     * then the new matrix will be <code>M * F</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * F * v</code>,
     * the frustum transformation will be applied first!
     * <p>
     * In order to set the matrix to a perspective frustum transformation without post-multiplying,
     * use {@link #setFrustumLH(double, double, double, double, double, double, boolean) setFrustumLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#perspective">http://www.songho.ca</a>
     * 
     * @see #setFrustumLH(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance along the x-axis to the left frustum edge
     * @param right
     *            the distance along the x-axis to the right frustum edge
     * @param bottom
     *            the distance along the y-axis to the bottom frustum edge
     * @param top
     *            the distance along the y-axis to the top frustum edge
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @param dest
     *            will hold the result
     * @return dest
     */
    public frustumLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest?: Matrix4): Matrix4
    public frustumLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, dest: Matrix4): Matrix4;
    public frustumLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean | Matrix4, dest?: Matrix4): Matrix4 {
        dest = dest ?? (zZeroToOne instanceof Matrix4 ? zZeroToOne : this);
        zZeroToOne = (typeof zZeroToOne === "boolean") ? zZeroToOne : false;

        if (this.PROPERTY_IDENTITY)
            return dest.setFrustumLH(left, right, bottom, top, zNear, zFar, zZeroToOne);
        return this.frustumLHGeneric(left, right, bottom, top, zNear, zFar, zZeroToOne, dest);
    }
    private frustumLHGeneric(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne: boolean, dest: Matrix4): Matrix4 {
        // calculate right matrix elements
        const rm00 = (zNear + zNear) / (right - left);
        const rm11 = (zNear + zNear) / (top - bottom);
        const rm20 = (right + left) / (right - left);
        const rm21 = (top + bottom) / (top - bottom);
        let rm22;
        let rm32;
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            rm22 = 1.0 - e;
            rm32 = (e - (zZeroToOne ? 1.0 : 2.0)) * zNear;
        } else if (nearInf) {
            const e = 1E-6;
            rm22 = (zZeroToOne ? 0.0 : 1.0) - e;
            rm32 = ((zZeroToOne ? 1.0 : 2.0) - e) * zFar;
        } else {
            rm22 = (zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear);
            rm32 = (zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar);
        }
        // perform optimized matrix multiplication
        const nm20 = this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22 + this.m30;
        const nm21 = this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22 + this.m31;
        const nm22 = this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22 + this.m32;
        const nm23 = this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22 + this.m33;
        dest.m00 = this.m00 * rm00;
        dest.m01 = this.m01 * rm00;
        dest.m02 = this.m02 * rm00;
        dest.m03 = this.m03 * rm00;
        dest.m10 = this.m10 * rm11;
        dest.m11 = this.m11 * rm11;
        dest.m12 = this.m12 * rm11;
        dest.m13 = this.m13 * rm11;
        dest.m30 = this.m20 * rm32;
        dest.m31 = this.m21 * rm32;
        dest.m32 = this.m22 * rm32;
        dest.m33 = this.m23 * rm32;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        // ._properties(0);
        return dest;
    }

    /**
     * Set this matrix to be an arbitrary perspective projection frustum transformation for a left-handed coordinate system
     * using OpenGL's NDC z range of <code>[-1..+1]</code>.
     * <p>
     * In order to apply the perspective frustum transformation to an existing transformation,
     * use {@link #frustumLH(double, double, double, double, double, double, boolean) frustumLH()}.
     * <p>
     * Reference: <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html#perspective">http://www.songho.ca</a>
     * 
     * @see #frustumLH(double, double, double, double, double, double, boolean)
     * 
     * @param left
     *            the distance along the x-axis to the left frustum edge
     * @param right
     *            the distance along the x-axis to the right frustum edge
     * @param bottom
     *            the distance along the y-axis to the bottom frustum edge
     * @param top
     *            the distance along the y-axis to the top frustum edge
     * @param zNear
     *            near clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the near clipping plane will be at positive infinity.
     *            In that case, <code>zFar</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zFar
     *            far clipping plane distance. This value must be greater than zero.
     *            If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *            In that case, <code>zNear</code> may not also be {@link Double#POSITIVE_INFINITY}.
     * @param zZeroToOne
     *            whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *            or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @return this
     */
    public setFrustumLH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number, zZeroToOne?: boolean): Matrix4 {
        zZeroToOne = zZeroToOne ?? false;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = (zNear + zNear) / (right - left);
        this.m11 = (zNear + zNear) / (top - bottom);
        this.m20 = (right + left) / (right - left);
        this.m21 = (top + bottom) / (top - bottom);
        const farInf = zFar > 0 && !isFinite(zFar);
        const nearInf = zNear > 0 && !isFinite(zNear);
        if (farInf) {
            // See: "Infinite Projection Matrix" (http://www.terathon.com/gdc07_lengyel.pdf)
            const e = 1E-6;
            this.m22 = (1.0 - e)
            this.m32 = ((e - (zZeroToOne ? 1.0 : 2.0)) * zNear);
        } else if (nearInf) {
            const e = 1E-6;
            this.m22 = ((zZeroToOne ? 0.0 : 1.0) - e)
            this.m32 = (((zZeroToOne ? 1.0 : 2.0) - e) * zFar);
        } else {
            this.m22 = ((zZeroToOne ? zFar : zFar + zNear) / (zFar - zNear))
            this.m32 = ((zZeroToOne ? zFar : zFar + zFar) * zNear / (zNear - zFar));
        }
        this.m23 = (1.0);
        this.m33 = (0.0);
        // properties = this.m20 == 0.0 && this.m21 == 0.0 ? PROPERTY_PERSPECTIVE : 0;
        return this;
    }

    /**
     * Set this matrix to represent a perspective projection equivalent to the given intrinsic camera calibration parameters.
     * The resulting matrix will be suited for a right-handed coordinate system using OpenGL's NDC z range of <code>[-1..+1]</code>.
     * <p>
     * See: <a href="https://en.wikipedia.org/wiki/Camera_resectioning#Intrinsic_parameters">https://en.wikipedia.org/</a>
     * <p>
     * Reference: <a href="http://ksimek.github.io/2013/06/03/calibrated_cameras_in_opengl/">http://ksimek.github.io/</a>
     * 
     * @param alphaX
     *          specifies the focal length and scale along the X axis
     * @param alphaY
     *          specifies the focal length and scale along the Y axis
     * @param gamma
     *          the skew coefficient between the X and Y axis (may be <code>0</code>)
     * @param u0
     *          the X coordinate of the principal point in image/sensor units
     * @param v0
     *          the Y coordinate of the principal point in image/sensor units
     * @param imgWidth
     *          the width of the sensor/image image/sensor units
     * @param imgHeight
     *          the height of the sensor/image image/sensor units
     * @param near
     *          the distance to the near plane
     * @param far
     *          the distance to the far plane
     * @return this
     */
    public setFromIntrinsic(alphaX: number, alphaY: number, gamma: number, u0: number, v0: number, imgWidth: number, imgHeight: number, near: number, far: number): Matrix4 {
        const l00 = 2.0 / imgWidth;
        const l11 = 2.0 / imgHeight;
        const l22 = 2.0 / (near - far);
        this.m00 = l00 * alphaX;
        this.m01 = 0.0;
        this.m02 = 0.0;
        this.m03 = 0.0;
        this.m10 = l00 * gamma;
        this.m11 = l11 * alphaY;
        this.m12 = 0.0;
        this.m13 = 0.0;
        this.m20 = l00 * u0 - 1.0;
        this.m21 = l11 * v0 - 1.0;
        this.m22 = l22 * -(near + far) + (far + near) / (near - far);
        this.m23 = -1.0;
        this.m30 = 0.0;
        this.m31 = 0.0;
        this.m32 = l22 * -near * far;
        this.m33 = 0.0;
        // this.properties = PROPERTY_PERSPECTIVE;
        return this;
    }

    // TODO: missing case ENUM defs for PLANE_{} and CORNER_{}

    // public frustumPlane(plane: number, dest: Vector4): Vector4 {
    //     switch (plane) {
    //         case PLANE_NX:
    //             dest.set(this.m03 + this.m00, this.m13 + this.m10, this.m23 + this.m20, this.m33 + this.m30).normalize3();
    //             break;
    //         case PLANE_PX:
    //             dest.set(this.m03 - this.m00, this.m13 - this.m10, this.m23 - this.m20, this.m33 - this.m30).normalize3();
    //             break;
    //         case PLANE_NY:
    //             dest.set(this.m03 + this.m01, this.m13 + this.m11, this.m23 + this.m21, this.m33 + this.m31).normalize3();
    //             break;
    //         case PLANE_PY:
    //             dest.set(this.m03 - this.m01, this.m13 - this.m11, this.m23 - this.m21, this.m33 - this.m31).normalize3();
    //             break;
    //         case PLANE_NZ:
    //             dest.set(this.m03 + this.m02, this.m13 + this.m12, this.m23 + this.m22, this.m33 + this.m32).normalize3();
    //             break;
    //         case PLANE_PZ:
    //             dest.set(this.m03 - this.m02, this.m13 - this.m12, this.m23 - this.m22, this.m33 - this.m32).normalize3();
    //             break;
    //         default:
    //             throw new IllegalArgumentException("dest"); //$NON-NLS-1$
    //     }
    //     return dest;
    // }

    // public frustumCorner(corner: number, dest: Vector3): Vector3 {
    //     let d1, d2, d3;
    //     let n1x, n1y, n1z, n2x, n2y, n2z, n3x, n3y, n3z;
    //     switch (corner) {
    //         case CORNER_NXNYNZ: // left, bottom, near
    //             n1x = this.m03 + this.m00; n1y = this.m13 + this.m10; n1z = this.m23 + this.m20; d1 = this.m33 + this.m30; // left
    //             n2x = this.m03 + this.m01; n2y = this.m13 + this.m11; n2z = this.m23 + this.m21; d2 = this.m33 + this.m31; // bottom
    //             n3x = this.m03 + this.m02; n3y = this.m13 + this.m12; n3z = this.m23 + this.m22; d3 = this.m33 + this.m32; // near
    //             break;
    //         case CORNER_PXNYNZ: // right, bottom, near
    //             n1x = this.m03 - this.m00; n1y = this.m13 - this.m10; n1z = this.m23 - this.m20; d1 = this.m33 - this.m30; // right
    //             n2x = this.m03 + this.m01; n2y = this.m13 + this.m11; n2z = this.m23 + this.m21; d2 = this.m33 + this.m31; // bottom
    //             n3x = this.m03 + this.m02; n3y = this.m13 + this.m12; n3z = this.m23 + this.m22; d3 = this.m33 + this.m32; // near
    //             break;
    //         case CORNER_PXPYNZ: // right, top, near
    //             n1x = this.m03 - this.m00; n1y = this.m13 - this.m10; n1z = this.m23 - this.m20; d1 = this.m33 - this.m30; // right
    //             n2x = this.m03 - this.m01; n2y = this.m13 - this.m11; n2z = this.m23 - this.m21; d2 = this.m33 - this.m31; // top
    //             n3x = this.m03 + this.m02; n3y = this.m13 + this.m12; n3z = this.m23 + this.m22; d3 = this.m33 + this.m32; // near
    //             break;
    //         case CORNER_NXPYNZ: // left, top, near
    //             n1x = this.m03 + this.m00; n1y = this.m13 + this.m10; n1z = this.m23 + this.m20; d1 = this.m33 + this.m30; // left
    //             n2x = this.m03 - this.m01; n2y = this.m13 - this.m11; n2z = this.m23 - this.m21; d2 = this.m33 - this.m31; // top
    //             n3x = this.m03 + this.m02; n3y = this.m13 + this.m12; n3z = this.m23 + this.m22; d3 = this.m33 + this.m32; // near
    //             break;
    //         case CORNER_PXNYPZ: // right, bottom, far
    //             n1x = this.m03 - this.m00; n1y = this.m13 - this.m10; n1z = this.m23 - this.m20; d1 = this.m33 - this.m30; // right
    //             n2x = this.m03 + this.m01; n2y = this.m13 + this.m11; n2z = this.m23 + this.m21; d2 = this.m33 + this.m31; // bottom
    //             n3x = this.m03 - this.m02; n3y = this.m13 - this.m12; n3z = this.m23 - this.m22; d3 = this.m33 - this.m32; // far
    //             break;
    //         case CORNER_NXNYPZ: // left, bottom, far
    //             n1x = this.m03 + this.m00; n1y = this.m13 + this.m10; n1z = this.m23 + this.m20; d1 = this.m33 + this.m30; // left
    //             n2x = this.m03 + this.m01; n2y = this.m13 + this.m11; n2z = this.m23 + this.m21; d2 = this.m33 + this.m31; // bottom
    //             n3x = this.m03 - this.m02; n3y = this.m13 - this.m12; n3z = this.m23 - this.m22; d3 = this.m33 - this.m32; // far
    //             break;
    //         case CORNER_NXPYPZ: // left, top, far
    //             n1x = this.m03 + this.m00; n1y = this.m13 + this.m10; n1z = this.m23 + this.m20; d1 = this.m33 + this.m30; // left
    //             n2x = this.m03 - this.m01; n2y = this.m13 - this.m11; n2z = this.m23 - this.m21; d2 = this.m33 - this.m31; // top
    //             n3x = this.m03 - this.m02; n3y = this.m13 - this.m12; n3z = this.m23 - this.m22; d3 = this.m33 - this.m32; // far
    //             break;
    //         case CORNER_PXPYPZ: // right, top, far
    //             n1x = this.m03 - this.m00; n1y = this.m13 - this.m10; n1z = this.m23 - this.m20; d1 = this.m33 - this.m30; // right
    //             n2x = this.m03 - this.m01; n2y = this.m13 - this.m11; n2z = this.m23 - this.m21; d2 = this.m33 - this.m31; // top
    //             n3x = this.m03 - this.m02; n3y = this.m13 - this.m12; n3z = this.m23 - this.m22; d3 = this.m33 - this.m32; // far
    //             break;
    //         default:
    //             throw new IllegalArgumentException("corner"); //$NON-NLS-1$
    //     }
    //     const c23x, c23y, c23z;
    //     c23x = n2y * n3z - n2z * n3y;
    //     c23y = n2z * n3x - n2x * n3z;
    //     c23z = n2x * n3y - n2y * n3x;
    //     const c31x, c31y, c31z;
    //     c31x = n3y * n1z - n3z * n1y;
    //     c31y = n3z * n1x - n3x * n1z;
    //     c31z = n3x * n1y - n3y * n1x;
    //     const c12x, c12y, c12z;
    //     c12x = n1y * n2z - n1z * n2y;
    //     c12y = n1z * n2x - n1x * n2z;
    //     c12z = n1x * n2y - n1y * n2x;
    //     const invDot = 1.0 / (n1x * c23x + n1y * c23y + n1z * c23z);
    //     dest.x = (-c23x * d1 - c31x * d2 - c12x * d3) * invDot;
    //     dest.y = (-c23y * d1 - c31y * d2 - c12y * d3) * invDot;
    //     dest.z = (-c23z * d1 - c31z * d2 - c12z * d3) * invDot;
    //     return dest;
    // }

    public perspectiveOrigin(dest: Vector3): Vector3 {
        /*
         * Simply compute the intersection point of the left, right and top frustum plane.
         */
        const n1x = this.m03 + this.m00, n1y = this.m13 + this.m10, n1z = this.m23 + this.m20, d1 = this.m33 + this.m30; // left
        const n2x = this.m03 - this.m00, n2y = this.m13 - this.m10, n2z = this.m23 - this.m20, d2 = this.m33 - this.m30; // right
        const n3x = this.m03 - this.m01, n3y = this.m13 - this.m11, n3z = this.m23 - this.m21, d3 = this.m33 - this.m31; // top

        const c23x = n2y * n3z - n2z * n3y;
        const c23y = n2z * n3x - n2x * n3z;
        const c23z = n2x * n3y - n2y * n3x;

        const c31x = n3y * n1z - n3z * n1y;
        const c31y = n3z * n1x - n3x * n1z;
        const c31z = n3x * n1y - n3y * n1x;

        const c12x = n1y * n2z - n1z * n2y;
        const c12y = n1z * n2x - n1x * n2z;
        const c12z = n1x * n2y - n1y * n2x;

        const invDot = 1.0 / (n1x * c23x + n1y * c23y + n1z * c23z);
        dest.x = (-c23x * d1 - c31x * d2 - c12x * d3) * invDot;
        dest.y = (-c23y * d1 - c31y * d2 - c12y * d3) * invDot;
        dest.z = (-c23z * d1 - c31z * d2 - c12z * d3) * invDot;
        return dest;
    }

    public perspectiveInvOrigin(dest: Vector3): Vector3 {
        const invW = 1.0 / this.m23;
        dest.x = this.m20 * invW;
        dest.y = this.m21 * invW;
        dest.z = this.m22 * invW;
        return dest;
    }

    public perspectiveFov(): number {
        /*
         * Compute the angle between the bottom and top frustum plane normals.
         */
        const n1x = this.m03 + this.m01; const n1y = this.m13 + this.m11; const n1z = this.m23 + this.m21; // bottom
        const n2x = this.m01 - this.m03; const n2y = this.m11 - this.m13; const n2z = this.m21 - this.m23; // top
        const n1len = Math.sqrt(n1x * n1x + n1y * n1y + n1z * n1z);
        const n2len = Math.sqrt(n2x * n2x + n2y * n2y + n2z * n2z);
        return Math.acos((n1x * n2x + n1y * n2y + n1z * n2z) / (n1len * n2len));
    }

    public perspectiveNear(): number {
        return this.m32 / (this.m23 + this.m22);
    }

    public perspectiveFar(): number {
        return this.m32 / (this.m22 - this.m23);
    }

    public frustumRayDir(x: number, y: number, dest: Vector3): Vector3 {
        /*
         * This method works by first obtaining the frustum plane normals,
         * then building the cross product to obtain the corner rays,
         * and finally bilinearly interpolating to obtain the desired direction.
         * The code below uses a condense form of doing all this making use 
         * of some mathematical identities to simplify the overall expression.
         */
        const a = this.m10 * this.m23, b = this.m13 * this.m21, c = this.m10 * this.m21, d = this.m11 * this.m23, e = this.m13 * this.m20, f = this.m11 * this.m20;
        const g = this.m03 * this.m20, h = this.m01 * this.m23, i = this.m01 * this.m20, j = this.m03 * this.m21, k = this.m00 * this.m23, l = this.m00 * this.m21;
        const m = this.m00 * this.m13, n = this.m03 * this.m11, o = this.m00 * this.m11, p = this.m01 * this.m13, q = this.m03 * this.m10, r = this.m01 * this.m10;

        const m1x = (d + e + f - a - b - c) * (1.0 - y) + (a - b - c + d - e + f) * y;
        const m1y = (j + k + l - g - h - i) * (1.0 - y) + (g - h - i + j - k + l) * y;
        const m1z = (p + q + r - m - n - o) * (1.0 - y) + (m - n - o + p - q + r) * y;

        const m2x = (b - c - d + e + f - a) * (1.0 - y) + (a + b - c - d - e + f) * y;
        const m2y = (h - i - j + k + l - g) * (1.0 - y) + (g + h - i - j - k + l) * y;
        const m2z = (n - o - p + q + r - m) * (1.0 - y) + (m + n - o - p - q + r) * y;
        dest.x = m1x * (1.0 - x) + m2x * x;
        dest.y = m1y * (1.0 - x) + m2y * x;
        dest.z = m1z * (1.0 - x) + m2z * x;
        return dest.normalize(dest);
    }

    public positiveZ(dir: Vector3): Vector3 {
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalizedPositiveZ(dir);
        return this.positiveZGeneric(dir);
    }
    private positiveZGeneric(dir: Vector3): Vector3 {
        return dir.set(
            this.m10 * this.m21 - this.m11 * this.m20,
            this.m20 * this.m01 - this.m21 * this.m00,
            this.m00 * this.m11 - this.m01 * this.m10).normalize();
    }

    public normalizedPositiveZ(dir: Vector3): Vector3 {
        return dir.set(this.m02, this.m12, this.m22);
    }

    public positiveX(dir: Vector3): Vector3 {
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalizedPositiveX(dir);
        return this.positiveXGeneric(dir);
    }
    private positiveXGeneric(dir: Vector3): Vector3 {
        return dir.set(
            this.m11 * this.m22 - this.m12 * this.m21,
            this.m02 * this.m21 - this.m01 * this.m22,
            this.m01 * this.m12 - this.m02 * this.m11).normalize();
    }

    public normalizedPositiveX(dir: Vector3): Vector3 {
        return dir.set(this.m00, this.m10, this.m20);
    }

    public positiveY(dir: Vector3): Vector3 {
        if (this.PROPERTY_ORTHONORMAL)
            return this.normalizedPositiveY(dir);
        return this.positiveYGeneric(dir);
    }
    private positiveYGeneric(dir: Vector3): Vector3 {
        return dir.set(
            this.m12 * this.m20 - this.m10 * this.m22,
            this.m00 * this.m22 - this.m02 * this.m20,
            this.m02 * this.m10 - this.m00 * this.m12).normalize();
    }

    public normalizedPositiveY(dir: Vector3): Vector3 {
        return dir.set(this.m01, this.m11, this.m21);
    }

    public originAffine(dest: Vector3): Vector3 {
        const a = this.m00 * this.m11 - this.m01 * this.m10;
        const b = this.m00 * this.m12 - this.m02 * this.m10;
        const d = this.m01 * this.m12 - this.m02 * this.m11;
        const g = this.m20 * this.m31 - this.m21 * this.m30;
        const h = this.m20 * this.m32 - this.m22 * this.m30;
        const j = this.m21 * this.m32 - this.m22 * this.m31;
        dest.x = -this.m10 * j + this.m11 * h - this.m12 * g;
        dest.y = +this.m00 * j - this.m01 * h + this.m02 * g;
        dest.z = -this.m30 * d + this.m31 * b - this.m32 * a;
        return dest;
    }

    public origin(dest: Vector3): Vector3 {
        if (this.PROPERTY_AFFINE)
            return this.originAffine(dest);
        return this.originGeneric(dest);
    }
    private originGeneric(dest: Vector3): Vector3 {
        const a = this.m00 * this.m11 - this.m01 * this.m10;
        const b = this.m00 * this.m12 - this.m02 * this.m10;
        const c = this.m00 * this.m13 - this.m03 * this.m10;
        const d = this.m01 * this.m12 - this.m02 * this.m11;
        const e = this.m01 * this.m13 - this.m03 * this.m11;
        const f = this.m02 * this.m13 - this.m03 * this.m12;
        const g = this.m20 * this.m31 - this.m21 * this.m30;
        const h = this.m20 * this.m32 - this.m22 * this.m30;
        const i = this.m20 * this.m33 - this.m23 * this.m30;
        const j = this.m21 * this.m32 - this.m22 * this.m31;
        const k = this.m21 * this.m33 - this.m23 * this.m31;
        const l = this.m22 * this.m33 - this.m23 * this.m32;
        const det = a * l - b * k + c * j + d * i - e * h + f * g;
        const invDet = 1.0 / det;
        const nm30 = (-this.m10 * j + this.m11 * h - this.m12 * g) * invDet;
        const nm31 = (+this.m00 * j - this.m01 * h + this.m02 * g) * invDet;
        const nm32 = (-this.m30 * d + this.m31 * b - this.m32 * a) * invDet;
        const nm33 = det / (this.m20 * d - this.m21 * b + this.m22 * a);
        const x = nm30 * nm33;
        const y = nm31 * nm33;
        const z = nm32 * nm33;
        return dest.set(x, y, z);
    }

    // TODO: shadow
    /**
     * Apply a projection transformation to this matrix that projects onto the plane specified via the general plane equation
     * <code>x*a + y*b + z*c + d = 0</code> as if casting a shadow from a given light position/direction <code>light</code>.
     * <p>
     * If <code>light.w</code> is <code>0.0</code> the light is being treated as a directional light; if it is <code>1.0</code> it is a point light.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the shadow matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * shadow projection will be applied first!
     * <p>
     * Reference: <a href="ftp://ftp.sgi.com/opengl/contrib/blythe/advanced99/notes/node192.html">ftp.sgi.com</a>
     * 
     * @param light
     *          the light's vector
     * @param a
     *          the x factor in the plane equation
     * @param b
     *          the y factor in the plane equation
     * @param c
     *          the z factor in the plane equation
     * @param d
     *          the constant in the plane equation
     * @return this
     */
    // public shadow(light: Vector4, a: number, b: number, c: number, d: number): Matrix4 {
    //     return shadow(light.x, light.y, light.z, light.w, a, b, c, d, this);
    // }

    // public shadow(light: Vector4, a: number, b: number, c: number, d: number, dest: Matrix4): Matrix4 {
    //     return shadow(light.x, light.y, light.z, light.w, a, b, c, d, dest);
    // }

    /**
     * Apply a projection transformation to this matrix that projects onto the plane specified via the general plane equation
     * <code>x*a + y*b + z*c + d = 0</code> as if casting a shadow from a given light position/direction <code>(lightX, lightY, lightZ, lightW)</code>.
     * <p>
     * If <code>lightW</code> is <code>0.0</code> the light is being treated as a directional light; if it is <code>1.0</code> it is a point light.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the shadow matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * shadow projection will be applied first!
     * <p>
     * Reference: <a href="ftp://ftp.sgi.com/opengl/contrib/blythe/advanced99/notes/node192.html">ftp.sgi.com</a>
     * 
     * @param lightX
     *          the x-component of the light's vector
     * @param lightY
     *          the y-component of the light's vector
     * @param lightZ
     *          the z-component of the light's vector
     * @param lightW
     *          the w-component of the light's vector
     * @param a
     *          the x factor in the plane equation
     * @param b
     *          the y factor in the plane equation
     * @param c
     *          the z factor in the plane equation
     * @param d
     *          the constant in the plane equation
     * @return this
     */
    // public shadow(lightX: number, lightY: number, lightZ: number, lightW: number, a: number, b: number, c: number, d: number): Matrix4 {
    //     return shadow(lightX, lightY, lightZ, lightW, a, b, c, d, this);
    // }

    public shadow(lightX: number, lightY: number, lightZ: number, lightW: number, a: number, b: number, c: number, d: number, dest: Matrix4): Matrix4 {
        // normalize plane
        const invPlaneLen = 1 / Math.sqrt(a * a + b * b + c * c);
        const an = a * invPlaneLen;
        const bn = b * invPlaneLen;
        const cn = c * invPlaneLen;
        const dn = d * invPlaneLen;

        const dot = an * lightX + bn * lightY + cn * lightZ + dn * lightW;

        // compute right matrix elements
        const rm00 = dot - an * lightX;
        const rm01 = -an * lightY;
        const rm02 = -an * lightZ;
        const rm03 = -an * lightW;
        const rm10 = -bn * lightX;
        const rm11 = dot - bn * lightY;
        const rm12 = -bn * lightZ;
        const rm13 = -bn * lightW;
        const rm20 = -cn * lightX;
        const rm21 = -cn * lightY;
        const rm22 = dot - cn * lightZ;
        const rm23 = -cn * lightW;
        const rm30 = -dn * lightX;
        const rm31 = -dn * lightY;
        const rm32 = -dn * lightZ;
        const rm33 = dot - dn * lightW;

        // matrix multiplication
        return dest.set(
            this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02 + this.m30 * rm03,
            this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02 + this.m31 * rm03,
            this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02 + this.m32 * rm03,
            this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02 + this.m33 * rm03,
            this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12 + this.m30 * rm13,
            this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12 + this.m31 * rm13,
            this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12 + this.m32 * rm13,
            this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12 + this.m33 * rm13,
            this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22 + this.m30 * rm23,
            this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22 + this.m31 * rm23,
            this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22 + this.m32 * rm23,
            this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22 + this.m33 * rm23,
            this.m00 * rm30 + this.m10 * rm31 + this.m20 * rm32 + this.m30 * rm33,
            this.m01 * rm30 + this.m11 * rm31 + this.m21 * rm32 + this.m31 * rm33,
            this.m02 * rm30 + this.m12 * rm31 + this.m22 * rm32 + this.m32 * rm33,
            this.m03 * rm30 + this.m13 * rm31 + this.m23 * rm32 + this.m33 * rm33,
        )
        //     ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        // return dest;
    }

    // public shadow(light: Vector4, planeTransform: Matrix4, dest: Matrix4): Matrix4 {
    //     // compute plane equation by transforming (y = 0)
    //     const a = planeTransform.m10;
    //     const b = planeTransform.m11;
    //     const c = planeTransform.m12;
    //     const d = -a * planeTransform.m30 - b * planeTransform.m31 - c * planeTransform.m32;
    //     return shadow(light.x, light.y, light.z, light.w, a, b, c, d, dest);
    // }

    /**
     * Apply a projection transformation to this matrix that projects onto the plane with the general plane equation
     * <code>y = 0</code> as if casting a shadow from a given light position/direction <code>light</code>.
     * <p>
     * Before the shadow projection is applied, the plane is transformed via the specified <code>planeTransformation</code>.
     * <p>
     * If <code>light.w</code> is <code>0.0</code> the light is being treated as a directional light; if it is <code>1.0</code> it is a point light.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the shadow matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * shadow projection will be applied first!
     * 
     * @param light
     *          the light's vector
     * @param planeTransform
     *          the transformation to transform the implied plane <code>y = 0</code> before applying the projection
     * @return this
     */
    // public shadow(light: Vector4, planeTransform: Matrix4): Matrix4 {
    //     return shadow(light, planeTransform, this);
    // }

    // public shadow(lightX: number, lightY: number, lightZ: number, lightW: number, planeTransform: Matrix4, dest: Matrix4): Matrix4 {
    //     // compute plane equation by transforming (y = 0)
    //     const a = planeTransform.m10;
    //     const b = planeTransform.m11;
    //     const c = planeTransform.m12;
    //     const d = -a * planeTransform.m30 - b * planeTransform.m31 - c * planeTransform.m32;
    //     return shadow(lightX, lightY, lightZ, lightW, a, b, c, d, dest);
    // }

    /**
     * Apply a projection transformation to this matrix that projects onto the plane with the general plane equation
     * <code>y = 0</code> as if casting a shadow from a given light position/direction <code>(lightX, lightY, lightZ, lightW)</code>.
     * <p>
     * Before the shadow projection is applied, the plane is transformed via the specified <code>planeTransformation</code>.
     * <p>
     * If <code>lightW</code> is <code>0.0</code> the light is being treated as a directional light; if it is <code>1.0</code> it is a point light.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>S</code> the shadow matrix,
     * then the new matrix will be <code>M * S</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * S * v</code>, the
     * shadow projection will be applied first!
     * 
     * @param lightX
     *          the x-component of the light vector
     * @param lightY
     *          the y-component of the light vector
     * @param lightZ
     *          the z-component of the light vector
     * @param lightW
     *          the w-component of the light vector
     * @param planeTransform
     *          the transformation to transform the implied plane <code>y = 0</code> before applying the projection
     * @return this
     */
    // public shadow(lightX: number, lightY: number, lightZ: number, lightW: number, planeTransform: Matrix4): Matrix4 {
    //     return shadow(lightX, lightY, lightZ, lightW, planeTransform, this);
    // }

    /**
     * Set this matrix to a cylindrical billboard transformation that rotates the local +Z axis of a given object with position <code>objPos</code> towards
     * a target position at <code>targetPos</code> while constraining a cylindrical rotation around the given <code>up</code> vector.
     * <p>
     * This method can be used to create the complete model transformation for a given object, including the translation of the object to
     * its position <code>objPos</code>.
     * 
     * @param objPos
     *          the position of the object to rotate towards <code>targetPos</code>
     * @param targetPos
     *          the position of the target (for example the camera) towards which to rotate the object
     * @param up
     *          the rotation axis (must be {@link Vector3d#normalize() normalized})
     * @return this
     */
    public billboardCylindrical(objPos: Vector3, targetPos: Vector3, up: Vector3): Matrix4 {
        let dirX = targetPos.x - objPos.x;
        let dirY = targetPos.y - objPos.y;
        let dirZ = targetPos.z - objPos.z;
        // left = up x dir
        let leftX = up.y * dirZ - up.z * dirY;
        let leftY = up.z * dirX - up.x * dirZ;
        let leftZ = up.x * dirY - up.y * dirX;
        // normalize left
        const invLeftLen = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLen;
        leftY *= invLeftLen;
        leftZ *= invLeftLen;
        // recompute dir by constraining rotation around 'up'
        // dir = left x up
        dirX = leftY * up.z - leftZ * up.y;
        dirY = leftZ * up.x - leftX * up.z;
        dirZ = leftX * up.y - leftY * up.x;
        // normalize dir
        const invDirLen = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        dirX *= invDirLen;
        dirY *= invDirLen;
        dirZ *= invDirLen;
        // set matrix elements
        this.m00 = leftX;
        this.m01 = leftY;
        this.m02 = leftZ;
        this.m03 = 0.0;
        this.m10 = up.x;
        this.m11 = up.y;
        this.m12 = up.z;
        this.m13 = 0.0;
        this.m20 = dirX;
        this.m21 = dirY;
        this.m22 = dirZ;
        this.m23 = 0.0;
        this.m30 = objPos.x;
        this.m31 = objPos.y;
        this.m32 = objPos.z;
        this.m33 = 1.0;
        // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
        return this;
    }

    /**
     * Set this matrix to a spherical billboard transformation that rotates the local +Z axis of a given object with position <code>objPos</code> towards
     * a target position at <code>targetPos</code>.
     * <p>
     * This method can be used to create the complete model transformation for a given object, including the translation of the object to
     * its position <code>objPos</code>.
     * <p>
     * If preserving an <i>up</i> vector is not necessary when rotating the +Z axis, then a shortest arc rotation can be obtained 
     * using {@link #billboardSpherical(Vector3dc, Vector3dc)}.
     * 
     * @see #billboardSpherical(Vector3dc, Vector3dc)
     * 
     * @param objPos
     *          the position of the object to rotate towards <code>targetPos</code>
     * @param targetPos
     *          the position of the target (for example the camera) towards which to rotate the object
     * @param up
     *          the up axis used to orient the object
     * @return this
     */
    public billboardSpherical(objPos: Vector3, targetPos: Vector3, up: Vector3): Matrix4;

    /**
     * Set this matrix to a spherical billboard transformation that rotates the local +Z axis of a given object with position <code>objPos</code> towards
     * a target position at <code>targetPos</code> using a shortest arc rotation by not preserving any <i>up</i> vector of the object.
     * <p>
     * This method can be used to create the complete model transformation for a given object, including the translation of the object to
     * its position <code>objPos</code>.
     * <p>
     * In order to specify an <i>up</i> vector which needs to be maintained when rotating the +Z axis of the object,
     * use {@link #billboardSpherical(Vector3, Vector3, Vector3)}.
     * 
     * @see #billboardSpherical(Vector3dc, Vector3dc, Vector3dc)
     * 
     * @param objPos
     *          the position of the object to rotate towards <code>targetPos</code>
     * @param targetPos
     *          the position of the target (for example the camera) towards which to rotate the object
     * @return this
     */
    public billboardSpherical(objPos: Vector3, targetPos: Vector3): Matrix4;
    public billboardSpherical(objPos: Vector3, targetPos: Vector3, up?: Vector3) {
        let dirX = targetPos.x - objPos.x;
        let dirY = targetPos.y - objPos.y;
        let dirZ = targetPos.z - objPos.z;
        if (up) {
            // normalize dir
            const invDirLen = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
            dirX *= invDirLen;
            dirY *= invDirLen;
            dirZ *= invDirLen;
            // left = up x dir
            let leftX = up.y * dirZ - up.z * dirY;
            let leftY = up.z * dirX - up.x * dirZ;
            let leftZ = up.x * dirY - up.y * dirX;
            // normalize left
            const invLeftLen = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
            leftX *= invLeftLen;
            leftY *= invLeftLen;
            leftZ *= invLeftLen;
            // up = dir x left
            const upX = dirY * leftZ - dirZ * leftY;
            const upY = dirZ * leftX - dirX * leftZ;
            const upZ = dirX * leftY - dirY * leftX;
            // set matrix elements
            this.m00 = leftX;
            this.m01 = leftY;
            this.m02 = leftZ;
            this.m03 = 0.0;
            this.m10 = upX;
            this.m11 = upY;
            this.m12 = upZ;
            this.m13 = 0.0;
            this.m20 = dirX;
            this.m21 = dirY;
            this.m22 = dirZ;
            this.m23 = 0.0;
            this.m30 = objPos.x;
            this.m31 = objPos.y;
            this.m32 = objPos.z;
            this.m33 = 1.0;
            // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
            return this;
        } else {
            let x = -dirY;
            let y = dirX;
            let w = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) + dirZ;
            const invNorm = 1 / Math.sqrt(x * x + y * y + w * w);
            x *= invNorm;
            y *= invNorm;
            w *= invNorm;
            const q00 = (x + x) * x;
            const q11 = (y + y) * y;
            const q01 = (x + x) * y;
            const q03 = (x + x) * w;
            const q13 = (y + y) * w;
            this.m00 = 1.0 - q11;
            this.m01 = q01;
            this.m02 = -q13;
            this.m03 = 0.0;
            this.m10 = q01;
            this.m11 = 1.0 - q00;
            this.m12 = q03;
            this.m13 = 0.0;
            this.m20 = q13;
            this.m21 = -q03;
            this.m22 = 1.0 - q11 - q00;
            this.m23 = 0.0;
            this.m30 = objPos.x;
            this.m31 = objPos.y;
            this.m32 = objPos.z;
            this.m33 = 1.0;
            // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
            return this;
        }
    }

    // public  hashCode() {
    //     final int prime = 31;
    //     int result = 1;
    //     long temp;
    //     temp = Double.doubleToLongBits(m00);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m01);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m02);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m03);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m10);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m11);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m12);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m13);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m20);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m21);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m22);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m23);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m30);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m31);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m32);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     temp = Double.doubleToLongBits(m33);
    //     result = prime * result + (int)(temp ^ (temp >>> 32));
    //     return result;
    // }

    // public equals(obj: Object): boolean {
    //     if (this == obj)
    //         return true;
    //     if (obj == null)
    //         return false;
    //     if (!(obj instanceof Matrix4d))
    //         return false;

    //     if (Double.doubleToLongBits(m00) != Double.doubleToLongBits(other.m00))
    //         return false;
    //     if (Double.doubleToLongBits(m01) != Double.doubleToLongBits(other.m01))
    //         return false;
    //     if (Double.doubleToLongBits(m02) != Double.doubleToLongBits(other.m02))
    //         return false;
    //     if (Double.doubleToLongBits(m03) != Double.doubleToLongBits(other.m03))
    //         return false;
    //     if (Double.doubleToLongBits(m10) != Double.doubleToLongBits(other.m10))
    //         return false;
    //     if (Double.doubleToLongBits(m11) != Double.doubleToLongBits(other.m11))
    //         return false;
    //     if (Double.doubleToLongBits(m12) != Double.doubleToLongBits(other.m12))
    //         return false;
    //     if (Double.doubleToLongBits(m13) != Double.doubleToLongBits(other.m13))
    //         return false;
    //     if (Double.doubleToLongBits(m20) != Double.doubleToLongBits(other.m20))
    //         return false;
    //     if (Double.doubleToLongBits(m21) != Double.doubleToLongBits(other.m21))
    //         return false;
    //     if (Double.doubleToLongBits(m22) != Double.doubleToLongBits(other.m22))
    //         return false;
    //     if (Double.doubleToLongBits(m23) != Double.doubleToLongBits(other.m23))
    //         return false;
    //     if (Double.doubleToLongBits(m30) != Double.doubleToLongBits(other.m30))
    //         return false;
    //     if (Double.doubleToLongBits(m31) != Double.doubleToLongBits(other.m31))
    //         return false;
    //     if (Double.doubleToLongBits(m32) != Double.doubleToLongBits(other.m32))
    //         return false;
    //     if (Double.doubleToLongBits(m33) != Double.doubleToLongBits(other.m33))
    //         return false;
    //     return true;
    // }

    public equals(m: any | Matrix4, delta?: number): boolean {
        delta = delta ?? 0;
        if (this == m)
            return true;
        if (m == null)
            return false;
        if (!(m instanceof Matrix4))
            return false;
        if (Math.abs(this.m00 - m.m00) < delta) return false;
        if (Math.abs(this.m01 - m.m01) < delta) return false;
        if (Math.abs(this.m02 - m.m02) < delta) return false;
        if (Math.abs(this.m03 - m.m03) < delta) return false;
        if (Math.abs(this.m10 - m.m10) < delta) return false;
        if (Math.abs(this.m11 - m.m11) < delta) return false;
        if (Math.abs(this.m12 - m.m12) < delta) return false;
        if (Math.abs(this.m13 - m.m13) < delta) return false;
        if (Math.abs(this.m20 - m.m20) < delta) return false;
        if (Math.abs(this.m21 - m.m21) < delta) return false;
        if (Math.abs(this.m22 - m.m22) < delta) return false;
        if (Math.abs(this.m23 - m.m23) < delta) return false;
        if (Math.abs(this.m30 - m.m30) < delta) return false;
        if (Math.abs(this.m31 - m.m31) < delta) return false;
        if (Math.abs(this.m32 - m.m32) < delta) return false;
        if (Math.abs(this.m33 - m.m33) < delta) return false;
        return true;
    }

    public pick(x: number, y: number, width: number, height: number, viewport: number[], dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        const sx = viewport[2] / width;
        const sy = viewport[3] / height;
        const tx = (viewport[2] + 2.0 * (viewport[0] - x)) / width;
        const ty = (viewport[3] + 2.0 * (viewport[1] - y)) / height;
        dest.m30 = this.m00 * tx + this.m10 * ty + this.m30;
        dest.m31 = this.m01 * tx + this.m11 * ty + this.m31;
        dest.m32 = this.m02 * tx + this.m12 * ty + this.m32;
        dest.m33 = this.m03 * tx + this.m13 * ty + this.m33;
        dest.m00 = this.m00 * sx;
        dest.m01 = this.m01 * sx;
        dest.m02 = this.m02 * sx;
        dest.m03 = this.m03 * sx;
        dest.m10 = this.m10 * sy;
        dest.m11 = this.m11 * sy;
        dest.m12 = this.m12 * sy;
        dest.m13 = this.m13 * sy;
        return dest;
    }

    public isAffine(): boolean {
        return this.m03 == 0.0 && this.m13 == 0.0 && this.m23 == 0.0 && this.m33 == 1.0;
    }

    /**
     * Exchange the values of <code>this</code> matrix with the given <code>other</code> matrix.
     * 
     * @param other
     *          the other matrix to exchange the values with
     * @return this
     */
    public swap(other: Matrix4): Matrix4 {
        let tmp;
        tmp = this.m00; this.m00 = other.m00; other.m00 = tmp;
        tmp = this.m01; this.m01 = other.m01; other.m01 = tmp;
        tmp = this.m02; this.m02 = other.m02; other.m02 = tmp;
        tmp = this.m03; this.m03 = other.m03; other.m03 = tmp;
        tmp = this.m10; this.m10 = other.m10; other.m10 = tmp;
        tmp = this.m11; this.m11 = other.m11; other.m11 = tmp;
        tmp = this.m12; this.m12 = other.m12; other.m12 = tmp;
        tmp = this.m13; this.m13 = other.m13; other.m13 = tmp;
        tmp = this.m20; this.m20 = other.m20; other.m20 = tmp;
        tmp = this.m21; this.m21 = other.m21; other.m21 = tmp;
        tmp = this.m22; this.m22 = other.m22; other.m22 = tmp;
        tmp = this.m23; this.m23 = other.m23; other.m23 = tmp;
        tmp = this.m30; this.m30 = other.m30; other.m30 = tmp;
        tmp = this.m31; this.m31 = other.m31; other.m31 = tmp;
        tmp = this.m32; this.m32 = other.m32; other.m32 = tmp;
        tmp = this.m33; this.m33 = other.m33; other.m33 = tmp;
        return this;
    }

    /**
     * Apply an arcball view transformation to this matrix with the given <code>radius</code> and <code>center</code>
     * position of the arcball and the specified X and Y rotation angles.
     * <p>
     * This method is equivalent to calling: <code>translate(0, 0, -radius).rotateX(angleX).rotateY(angleY).translate(-center.x, -center.y, -center.z)</code>
     * 
     * @param radius
     *          the arcball radius
     * @param center
     *          the center position of the arcball
     * @param angleX
     *          the rotation angle around the X axis in radians
     * @param angleY
     *          the rotation angle around the Y axis in radians
     * @return dest
     */
    public arcball(radius: number, center: Vector3, angleX: number, angleY: number, dest?: Matrix4): Matrix4;
    public arcball(radius: number, centerX: number, centerY: number, centerZ: number, angleX: number, angleY: number, dest: Matrix4): Matrix4;
    public arcball(radius: number, centerX: number | Vector3, centerY: number, centerZ: number, angleX?: number | Matrix4, angleY?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (angleX instanceof Matrix4 ? angleX : this);
        if (centerX instanceof Vector3) {
            angleY = centerZ, angleX = centerY;
            centerZ = centerX.z, centerY = centerX.y, centerX = centerX.x;
        } else {
            angleX = angleX as number;
        }

        const m30 = this.m20 * -radius + this.m30;
        const m31 = this.m21 * -radius + this.m31;
        const m32 = this.m22 * -radius + this.m32;
        const m33 = this.m23 * -radius + this.m33;
        let sin = Math.sin(angleX);
        let cos = Math.cos(angleX);
        const nm10 = this.m10 * cos + this.m20 * sin;
        const nm11 = this.m11 * cos + this.m21 * sin;
        const nm12 = this.m12 * cos + this.m22 * sin;
        const nm13 = this.m13 * cos + this.m23 * sin;
        const m20 = this.m20 * cos - this.m10 * sin;
        const m21 = this.m21 * cos - this.m11 * sin;
        const m22 = this.m22 * cos - this.m12 * sin;
        const m23 = this.m23 * cos - this.m13 * sin;
        sin = Math.sin(angleY);
        cos = Math.cos(angleY);
        const nm00 = this.m00 * cos - m20 * sin;
        const nm01 = this.m01 * cos - m21 * sin;
        const nm02 = this.m02 * cos - m22 * sin;
        const nm03 = this.m03 * cos - m23 * sin;
        const nm20 = this.m00 * sin + m20 * cos;
        const nm21 = this.m01 * sin + m21 * cos;
        const nm22 = this.m02 * sin + m22 * cos;
        const nm23 = this.m03 * sin + m23 * cos;
        dest.m30 = -nm00 * centerX - nm10 * centerY - nm20 * centerZ + m30;
        dest.m31 = -nm01 * centerX - nm11 * centerY - nm21 * centerZ + m31;
        dest.m32 = -nm02 * centerX - nm12 * centerY - nm22 * centerZ + m32;
        dest.m33 = -nm03 * centerX - nm13 * centerY - nm23 * centerZ + m33;
        dest.m20 = nm20;
        dest.m21 = nm21;
        dest.m22 = nm22;
        dest.m23 = nm23;
        dest.m10 = nm10;
        dest.m11 = nm11;
        dest.m12 = nm12;
        dest.m13 = nm13;
        dest.m00 = nm00;
        dest.m01 = nm01;
        dest.m02 = nm02;
        dest.m03 = nm03;
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        return dest;
    }

    /**
     * Compute the axis-aligned bounding box of the frustum described by <code>this</code> matrix and store the minimum corner
     * coordinates in the given <code>min</code> and the maximum corner coordinates in the given <code>max</code> vector.
     * <p>
     * The matrix <code>this</code> is assumed to be the {@link #invert() inverse} of the origial view-projection matrix
     * for which to compute the axis-aligned bounding box in world-space.
     * <p>
     * The axis-aligned bounding box of the unit frustum is <code>(-1, -1, -1)</code>, <code>(1, 1, 1)</code>.
     * 
     * @param min
     *          will hold the minimum corner coordinates of the axis-aligned bounding box
     * @param max
     *          will hold the maximum corner coordinates of the axis-aligned bounding box
     * @return this
     */
    public frustumAabb(min: Vector3, max: Vector3): Matrix4 {
        let minX = Infinity;
        let minY = Infinity;
        let minZ = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        let maxZ = -Infinity;
        for (let t: number = 0; t < 8; t++) {
            const x = ((t & 1) << 1) - 1.0;
            const y = (((t >>> 1) & 1) << 1) - 1.0;
            const z = (((t >>> 2) & 1) << 1) - 1.0;
            const invW = 1.0 / (this.m03 * x + this.m13 * y + this.m23 * z + this.m33);
            const nx = (this.m00 * x + this.m10 * y + this.m20 * z + this.m30) * invW;
            const ny = (this.m01 * x + this.m11 * y + this.m21 * z + this.m31) * invW;
            const nz = (this.m02 * x + this.m12 * y + this.m22 * z + this.m32) * invW;
            minX = minX < nx ? minX : nx;
            minY = minY < ny ? minY : ny;
            minZ = minZ < nz ? minZ : nz;
            maxX = maxX > nx ? maxX : nx;
            maxY = maxY > ny ? maxY : ny;
            maxZ = maxZ > nz ? maxZ : nz;
        }
        min.x = minX;
        min.y = minY;
        min.z = minZ;
        max.x = maxX;
        max.y = maxY;
        max.z = maxZ;
        return this;
    }

    public projectedGridRange(projector: Matrix4, sLower: number, sUpper: number, dest: Matrix4): Matrix4 {
        // Compute intersection with frustum edges and plane
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        let intersection = false;
        for (let t: number = 0; t < 3 * 4; t++) {
            let c0X, c0Y, c0Z;
            let c1X, c1Y, c1Z;
            if (t < 4) {
                // all x edges
                c0X = -1; c1X = +1;
                c0Y = c1Y = ((t & 1) << 1) - 1.0;
                c0Z = c1Z = (((t >>> 1) & 1) << 1) - 1.0;
            } else if (t < 8) {
                // all y edges
                c0Y = -1; c1Y = +1;
                c0X = c1X = ((t & 1) << 1) - 1.0;
                c0Z = c1Z = (((t >>> 1) & 1) << 1) - 1.0;
            } else {
                // all z edges
                c0Z = -1; c1Z = +1;
                c0X = c1X = ((t & 1) << 1) - 1.0;
                c0Y = c1Y = (((t >>> 1) & 1) << 1) - 1.0;
            }
            // unproject corners
            let invW = 1.0 / (this.m03 * c0X + this.m13 * c0Y + this.m23 * c0Z + this.m33);
            const p0x = (this.m00 * c0X + this.m10 * c0Y + this.m20 * c0Z + this.m30) * invW;
            const p0y = (this.m01 * c0X + this.m11 * c0Y + this.m21 * c0Z + this.m31) * invW;
            const p0z = (this.m02 * c0X + this.m12 * c0Y + this.m22 * c0Z + this.m32) * invW;
            invW = 1.0 / (this.m03 * c1X + this.m13 * c1Y + this.m23 * c1Z + this.m33);
            const p1x = (this.m00 * c1X + this.m10 * c1Y + this.m20 * c1Z + this.m30) * invW;
            const p1y = (this.m01 * c1X + this.m11 * c1Y + this.m21 * c1Z + this.m31) * invW;
            const p1z = (this.m02 * c1X + this.m12 * c1Y + this.m22 * c1Z + this.m32) * invW;
            const dirX = p1x - p0x;
            const dirY = p1y - p0y;
            const dirZ = p1z - p0z;
            const invDenom = 1.0 / dirY;
            // test for intersection
            for (let s: number = 0; s < 2; s++) {
                const isectT = -(p0y + (s == 0 ? sLower : sUpper)) * invDenom;
                if (isectT >= 0.0 && isectT <= 1.0) {
                    intersection = true;
                    // project with projector matrix
                    const ix = p0x + isectT * dirX;
                    const iz = p0z + isectT * dirZ;
                    invW = 1.0 / (projector.m03 * ix + projector.m23 * iz + projector.m33);
                    const px = (projector.m00 * ix + projector.m20 * iz + projector.m30) * invW;
                    const py = (projector.m01 * ix + projector.m21 * iz + projector.m31) * invW;
                    minX = minX < px ? minX : px;
                    minY = minY < py ? minY : py;
                    maxX = maxX > px ? maxX : px;
                    maxY = maxY > py ? maxY : py;
                }
            }
        }
        if (!intersection)
            return null; // <- projected grid is not visible
        dest.set(maxX - minX, 0, 0, 0, 0, maxY - minY, 0, 0, 0, 0, 1, 0, minX, minY, 0, 1)
        // ._properties(PROPERTY_AFFINE);
        return dest;
    }

    public perspectiveFrustumSlice(near: number, far: number, dest: Matrix4): Matrix4 {
        const invOldNear = (this.m23 + this.m22) / this.m32;
        const invNearFar = 1.0 / (near - far);
        dest.m00 = this.m00 * invOldNear * near;
        dest.m01 = this.m01;
        dest.m02 = this.m02;
        dest.m03 = this.m03;
        dest.m10 = this.m10;
        dest.m11 = this.m11 * invOldNear * near;
        dest.m12 = this.m12;
        dest.m13 = this.m13;
        dest.m20 = this.m20;
        dest.m21 = this.m21;
        dest.m22 = (far + near) * invNearFar;
        dest.m23 = this.m23;
        dest.m30 = this.m30;
        dest.m31 = this.m31;
        dest.m32 = (far + far) * near * invNearFar;
        dest.m33 = this.m33;
        // ._properties(properties & ~(PROPERTY_IDENTITY | PROPERTY_TRANSLATION | PROPERTY_ORTHONORMAL));
        return dest;
    }

    public orthoCrop(view: Matrix4, dest: Matrix4): Matrix4 {
        // determine min/max world z and min/max orthographically view-projected x/y
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        for (let t: number = 0; t < 8; t++) {
            const x = ((t & 1) << 1) - 1.0;
            const y = (((t >>> 1) & 1) << 1) - 1.0;
            const z = (((t >>> 2) & 1) << 1) - 1.0;
            let invW = 1.0 / (this.m03 * x + this.m13 * y + this.m23 * z + this.m33);
            const wx = (this.m00 * x + this.m10 * y + this.m20 * z + this.m30) * invW;
            const wy = (this.m01 * x + this.m11 * y + this.m21 * z + this.m31) * invW;
            const wz = (this.m02 * x + this.m12 * y + this.m22 * z + this.m32) * invW;
            invW = 1.0 / (view.m03 * wx + view.m13 * wy + view.m23 * wz + view.m33);
            const vx = view.m00 * wx + view.m10 * wy + view.m20 * wz + view.m30;
            const vy = view.m01 * wx + view.m11 * wy + view.m21 * wz + view.m31;
            const vz = (view.m02 * wx + view.m12 * wy + view.m22 * wz + view.m32) * invW;
            minX = minX < vx ? minX : vx;
            maxX = maxX > vx ? maxX : vx;
            minY = minY < vy ? minY : vy;
            maxY = maxY > vy ? maxY : vy;
            minZ = minZ < vz ? minZ : vz;
            maxZ = maxZ > vz ? maxZ : vz;
        }
        // build crop projection matrix to fit 'this' frustum into view
        return dest.setOrtho(minX, maxX, minY, maxY, -maxZ, -minZ);
    }

    /**
     * Set <code>this</code> matrix to a perspective transformation that maps the trapezoid spanned by the four corner coordinates
     * <code>(p0x, p0y)</code>, <code>(p1x, p1y)</code>, <code>(p2x, p2y)</code> and <code>(p3x, p3y)</code> to the unit square <code>[(-1, -1)..(+1, +1)]</code>.
     * <p>
     * The corner coordinates are given in counter-clockwise order starting from the <i>left</i> corner on the smaller parallel side of the trapezoid
     * seen when looking at the trapezoid oriented with its shorter parallel edge at the bottom and its longer parallel edge at the top.
     * <p>
     * Reference: <a href="http://www.comp.nus.edu.sg/~tants/tsm/TSM_recipe.html">Trapezoidal Shadow Maps (TSM) - Recipe</a>
     * 
     * @param p0x
     *          the x coordinate of the left corner at the shorter edge of the trapezoid
     * @param p0y
     *          the y coordinate of the left corner at the shorter edge of the trapezoid
     * @param p1x
     *          the x coordinate of the right corner at the shorter edge of the trapezoid
     * @param p1y
     *          the y coordinate of the right corner at the shorter edge of the trapezoid
     * @param p2x
     *          the x coordinate of the right corner at the longer edge of the trapezoid
     * @param p2y
     *          the y coordinate of the right corner at the longer edge of the trapezoid
     * @param p3x
     *          the x coordinate of the left corner at the longer edge of the trapezoid
     * @param p3y
     *          the y coordinate of the left corner at the longer edge of the trapezoid
     * @return this
     */
    public trapezoidCrop(p0x: number, p0y: number, p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number) {
        const aX = p1y - p0y, aY = p0x - p1x;
        let nm00 = aY;
        let nm10 = -aX;
        let nm30 = aX * p0y - aY * p0x;
        let nm01 = aX;
        let nm11 = aY;
        let nm31 = -(aX * p0x + aY * p0y);
        let c3x = nm00 * p3x + nm10 * p3y + nm30;
        let c3y = nm01 * p3x + nm11 * p3y + nm31;
        const s = -c3x / c3y;
        nm00 += s * nm01;
        nm10 += s * nm11;
        nm30 += s * nm31;
        const d1x = nm00 * p1x + nm10 * p1y + nm30;
        const d2x = nm00 * p2x + nm10 * p2y + nm30;
        const d = d1x * c3y / (d2x - d1x);
        nm31 += d;
        const sx = 2.0 / d2x;
        const sy = 1.0 / (c3y + d);
        const u = (sy + sy) * d / (1.0 - sy * d);
        const m03 = nm01 * sy;
        const m13 = nm11 * sy;
        const m33 = nm31 * sy;
        nm01 = (u + 1.0) * m03;
        nm11 = (u + 1.0) * m13;
        nm31 = (u + 1.0) * m33 - u;
        nm00 = sx * nm00 - m03;
        nm10 = sx * nm10 - m13;
        nm30 = sx * nm30 - m33;
        this.set(
            nm00, nm01, 0, m03,
            nm10, nm11, 0, m13,
            0, 0, 1, 0,
            nm30, nm31, 0, m33);
        return this;
    }
    public transformAab(min: Vector3, max: Vector3, outMin: Vector3, outMax: Vector3): Matrix4
    public transformAab(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, outMin: Vector3, outMax: Vector3): Matrix4;
    public transformAab(minX: number | Vector3, minY: number | Vector3, minZ: number | Vector3, maxX: number | Vector3,
        maxY?: number, maxZ?: number, outMin?: Vector3, outMax?: Vector3): Matrix4 {
        outMin = outMin ?? minZ as Vector3; minZ = minZ as number;
        outMax = outMax ?? maxX as Vector3; maxX = maxX as number;

        if (minY instanceof Vector3) {
            maxZ = minY.z, maxY = minY.y, maxX = minY.x;
            minY = 0;
        }
        if (minX instanceof Vector3) {
            minZ = minX.z, minY = minX.y, minX = minX.x;
        }

        const xax = this.m00 * minX, xay = this.m01 * minX, xaz = this.m02 * minX;
        const xbx = this.m00 * maxX, xby = this.m01 * maxX, xbz = this.m02 * maxX;
        const yax = this.m10 * minY, yay = this.m11 * minY, yaz = this.m12 * minY;
        const ybx = this.m10 * maxY, yby = this.m11 * maxY, ybz = this.m12 * maxY;
        const zax = this.m20 * minZ, zay = this.m21 * minZ, zaz = this.m22 * minZ;
        const zbx = this.m20 * maxZ, zby = this.m21 * maxZ, zbz = this.m22 * maxZ;

        outMin.x = Math.min(xax, xbx) + Math.min(yax, ybx) + Math.min(zax, zbx) + this.m30;
        outMin.y = Math.min(xay, xby) + Math.min(yay, yby) + Math.min(zay, zby) + this.m31;
        outMin.z = Math.min(xaz, xbz) + Math.min(yaz, ybz) + Math.min(zaz, zbz) + this.m32;
        outMax.x = Math.max(xax, xbx) + Math.max(yax, ybx) + Math.max(zax, zbx) + this.m30;
        outMax.y = Math.max(xay, xby) + Math.max(yay, yby) + Math.max(zay, zby) + this.m31;
        outMax.z = Math.max(xaz, xbz) + Math.max(yaz, ybz) + Math.max(zaz, zbz) + this.m32;
        return this;
    }

    /**
     * Linearly interpolate <code>this</code> and <code>other</code> using the given interpolation factor <code>t</code>
     * and store the result in <code>this</code>.
     * <p>
     * If <code>t</code> is <code>0.0</code> then the result is <code>this</code>. If the interpolation factor is <code>1.0</code>
     * then the result is <code>other</code>.
     *
     * @param other
     *          the other matrix
     * @param t
     *          the interpolation factor between 0.0 and 1.0
     * @param dest
     *          will hold the result
     * @return dest
     */
    public lerp(other: Matrix4, t: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        dest.m00 = (other.m00 - this.m00) * t + this.m00
        dest.m01 = (other.m01 - this.m01) * t + this.m01
        dest.m02 = (other.m02 - this.m02) * t + this.m02
        dest.m03 = (other.m03 - this.m03) * t + this.m03
        dest.m10 = (other.m10 - this.m10) * t + this.m10
        dest.m11 = (other.m11 - this.m11) * t + this.m11
        dest.m12 = (other.m12 - this.m12) * t + this.m12
        dest.m13 = (other.m13 - this.m13) * t + this.m13
        dest.m20 = (other.m20 - this.m20) * t + this.m20
        dest.m21 = (other.m21 - this.m21) * t + this.m21
        dest.m22 = (other.m22 - this.m22) * t + this.m22
        dest.m23 = (other.m23 - this.m23) * t + this.m23
        dest.m30 = (other.m30 - this.m30) * t + this.m30
        dest.m31 = (other.m31 - this.m31) * t + this.m31
        dest.m32 = (other.m32 - this.m32) * t + this.m32
        dest.m33 = (other.m33 - this.m33) * t + this.m33
        return dest;
    }

    /**
     * Apply a model transformation to this matrix for a right-handed coordinate system, 
     * that aligns the local <code>+Z</code> axis with <code>direction</code>
     * and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying it,
     * use {@link #rotationTowards(Vector3dc, Vector3dc) rotationTowards()}.
     * <p>
     * This method is equivalent to calling: <code>mulAffine(new Matrix4d().lookAt(new Vector3d(), new Vector3d(dir).negate(), up).invertAffine(), dest)</code>
     * 
     * @see #rotateTowards(double, double, double, double, double, double, Matrix4d)
     * @see #rotationTowards(Vector3dc, Vector3dc)
     * 
     * @param direction
     *              the direction to rotate towards
     * @param up
     *              the up vector
     * @param dest
     *              will hold the result
     * @return dest
     */
    public rotateTowards(direction: Vector3, up: Vector3, dest?: Matrix4): Matrix4;

    /**
     * Apply a model transformation to this matrix for a right-handed coordinate system, 
     * that aligns the local <code>+Z</code> axis with <code>dir</code>
     * and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>L</code> the lookat matrix,
     * then the new matrix will be <code>M * L</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * L * v</code>,
     * the lookat transformation will be applied first!
     * <p>
     * In order to set the matrix to a rotation transformation without post-multiplying it,
     * use {@link #rotationTowards(double, double, double, double, double, double) rotationTowards()}.
     * <p>
     * This method is equivalent to calling: <code>mulAffine(new Matrix4d().lookAt(0, 0, 0, -dirX, -dirY, -dirZ, upX, upY, upZ).invertAffine(), dest)</code>
     * 
     * @see #rotateTowards(Vector3dc, Vector3dc)
     * @see #rotationTowards(double, double, double, double, double, double)
     * 
     * @param dirX
     *              the x-coordinate of the direction to rotate towards
     * @param dirY
     *              the y-coordinate of the direction to rotate towards
     * @param dirZ
     *              the z-coordinate of the direction to rotate towards
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @param dest
     *              will hold the result
     * @return dest
     */
    public rotateTowards(dirX: number, dirY: number, dirZ: number, upX: number, upY: number, upZ: number, dest?: Matrix4): Matrix4;
    public rotateTowards(dirX: number | Vector3, dirY: number | Vector3, dirZ?: number | Matrix4, upX?: number, upY?: number, upZ?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (dirZ instanceof Matrix4 ? dirZ : this);

        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        } else {
            dirY = dirY as number, dirZ = dirZ as number;
        }


        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const ndirX = dirX * invDirLength;
        const ndirY = dirY * invDirLength;
        const ndirZ = dirZ * invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * ndirZ - upZ * ndirY;
        leftY = upZ * ndirX - upX * ndirZ;
        leftZ = upX * ndirY - upY * ndirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = ndirY * leftZ - ndirZ * leftY;
        const upnY = ndirZ * leftX - ndirX * leftZ;
        const upnZ = ndirX * leftY - ndirY * leftX;
        const rm00 = leftX;
        const rm01 = leftY;
        const rm02 = leftZ;
        const rm10 = upnX;
        const rm11 = upnY;
        const rm12 = upnZ;
        const rm20 = ndirX;
        const rm21 = ndirY;
        const rm22 = ndirZ;
        const nm00 = this.m00 * rm00 + this.m10 * rm01 + this.m20 * rm02;
        const nm01 = this.m01 * rm00 + this.m11 * rm01 + this.m21 * rm02;
        const nm02 = this.m02 * rm00 + this.m12 * rm01 + this.m22 * rm02;
        const nm03 = this.m03 * rm00 + this.m13 * rm01 + this.m23 * rm02;
        const nm10 = this.m00 * rm10 + this.m10 * rm11 + this.m20 * rm12;
        const nm11 = this.m01 * rm10 + this.m11 * rm11 + this.m21 * rm12;
        const nm12 = this.m02 * rm10 + this.m12 * rm11 + this.m22 * rm12;
        const nm13 = this.m03 * rm10 + this.m13 * rm11 + this.m23 * rm12;
        dest.m30 = (this.m30)
        dest.m31 = (this.m31)
        dest.m32 = (this.m32)
        dest.m33 = (this.m33)
        dest.m20 = (this.m00 * rm20 + this.m10 * rm21 + this.m20 * rm22)
        dest.m21 = (this.m01 * rm20 + this.m11 * rm21 + this.m21 * rm22)
        dest.m22 = (this.m02 * rm20 + this.m12 * rm21 + this.m22 * rm22)
        dest.m23 = (this.m03 * rm20 + this.m13 * rm21 + this.m23 * rm22)
        dest.m00 = (nm00)
        dest.m01 = (nm01)
        dest.m02 = (nm02)
        dest.m03 = (nm03)
        dest.m10 = (nm10)
        dest.m11 = (nm11)
        dest.m12 = (nm12)
        dest.m13 = (nm13)
        // ._properties(properties & ~(PROPERTY_PERSPECTIVE | PROPERTY_IDENTITY | PROPERTY_TRANSLATION));
        return dest;
    }

    /**
     * Set this matrix to a model transformation for a right-handed coordinate system, 
     * that aligns the local <code>-z</code> axis with <code>dir</code>.
     * <p>
     * In order to apply the rotation transformation to a previous existing transformation,
     * use {@link #rotateTowards(double, double, double, double, double, double) rotateTowards}.
     * <p>
     * This method is equivalent to calling: <code>setLookAt(new Vector3d(), new Vector3d(dir).negate(), up).invertAffine()</code>
     * 
     * @see #rotationTowards(Vector3dc, Vector3dc)
     * @see #rotateTowards(double, double, double, double, double, double)
     * 
     * @param dir
     *              the direction to orient the local -z axis towards
     * @param up
     *              the up vector
     * @return this
     */
    public rotationTowards(dir: Vector3, up: Vector3): Matrix4;
    /**
     * Set this matrix to a model transformation for a right-handed coordinate system, 
     * that aligns the local <code>-z</code> axis with <code>dir</code>.
     * <p>
     * In order to apply the rotation transformation to a previous existing transformation,
     * use {@link #rotateTowards(double, double, double, double, double, double) rotateTowards}.
     * <p>
     * This method is equivalent to calling: <code>setLookAt(0, 0, 0, -dirX, -dirY, -dirZ, upX, upY, upZ).invertAffine()</code>
     * 
     * @see #rotateTowards(Vector3dc, Vector3dc)
     * @see #rotationTowards(double, double, double, double, double, double)
     * 
     * @param dirX
     *              the x-coordinate of the direction to rotate towards
     * @param dirY
     *              the y-coordinate of the direction to rotate towards
     * @param dirZ
     *              the z-coordinate of the direction to rotate towards
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @return this
     */
    public rotationTowards(dirX: number, dirY: number, dirZ: number, upX: number, upY: number, upZ: number): Matrix4;
    public rotationTowards(dirX: number | Vector3, dirY: number | Vector3, dirZ?: number, upX?: number, upY?: number, upZ?: number): Matrix4 {
        if (dirY instanceof Vector3) {
            upZ = dirY.z, upY = dirY.y, upX = dirY.x;
            dirY = 0;
        }
        if (dirX instanceof Vector3) {
            dirZ = dirX.z, dirY = dirX.y, dirX = dirX.x;
        }
        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const ndirX = dirX * invDirLength;
        const ndirY = dirY * invDirLength;
        const ndirZ = dirZ * invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * ndirZ - upZ * ndirY;
        leftY = upZ * ndirX - upX * ndirZ;
        leftZ = upX * ndirY - upY * ndirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = ndirY * leftZ - ndirZ * leftY;
        const upnY = ndirZ * leftX - ndirX * leftZ;
        const upnZ = ndirX * leftY - ndirY * leftX;
        if (!this.PROPERTY_IDENTITY)
            this.identity();
        this.m00 = leftX;
        this.m01 = leftY;
        this.m02 = leftZ;
        this.m10 = upnX;
        this.m11 = upnY;
        this.m12 = upnZ;
        this.m20 = ndirX;
        this.m21 = ndirY;
        this.m22 = ndirZ;
        // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
        return this;
    }

    /**
     * Set this matrix to a model transformation for a right-handed coordinate system, 
     * that translates to the given <code>pos</code> and aligns the local <code>-z</code>
     * axis with <code>dir</code>.
     * <p>
     * This method is equivalent to calling: <code>translation(pos).rotateTowards(dir, up)</code>
     * 
     * @see #translation(Vector3dc)
     * @see #rotateTowards(Vector3dc, Vector3dc)
     *
     * @param pos
     *              the position to translate to
     * @param dir
     *              the direction to rotate towards
     * @param up
     *              the up vector
     * @return this
     */
    public translationRotateTowards(pos: Vector3, dir: Vector3, up: Vector3): Matrix4;
    /**
     * Set this matrix to a model transformation for a right-handed coordinate system, 
     * that translates to the given <code>(posX, posY, posZ)</code> and aligns the local <code>-z</code>
     * axis with <code>(dirX, dirY, dirZ)</code>.
     * <p>
     * This method is equivalent to calling: <code>translation(posX, posY, posZ).rotateTowards(dirX, dirY, dirZ, upX, upY, upZ)</code>
     * 
     * @see #translation(double, double, double)
     * @see #rotateTowards(double, double, double, double, double, double)
     * 
     * @param posX
     *              the x-coordinate of the position to translate to
     * @param posY
     *              the y-coordinate of the position to translate to
     * @param posZ
     *              the z-coordinate of the position to translate to
     * @param dirX
     *              the x-coordinate of the direction to rotate towards
     * @param dirY
     *              the y-coordinate of the direction to rotate towards
     * @param dirZ
     *              the z-coordinate of the direction to rotate towards
     * @param upX
     *              the x-coordinate of the up vector
     * @param upY
     *              the y-coordinate of the up vector
     * @param upZ
     *              the z-coordinate of the up vector
     * @return this
     */
    public translationRotateTowards(posX: number, posY: number, posZ: number, dirX: number, dirY: number, dirZ: number, upX: number, upY: number, upZ: number): Matrix4;
    public translationRotateTowards(posX: number | Vector3, posY: number | Vector3, posZ: number | Vector3,
        dirX?: number, dirY?: number, dirZ?: number, upX?: number, upY?: number, upZ?: number): Matrix4 {
        if (posZ instanceof Vector3) {
            upZ = posZ.z, upY = posZ.y, upX = posZ.x;
            posZ = 0;
        }
        if (posY instanceof Vector3) {
            dirZ = posY.z, dirY = posY.y, dirX = posY.x;
            posY = 0;
        }
        if (posX instanceof Vector3) {
            posZ = posX.z, posY = posX.y, posX = posX.x;
        }

        // Normalize direction
        const invDirLength = 1 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        const ndirX = dirX * invDirLength;
        const ndirY = dirY * invDirLength;
        const ndirZ = dirZ * invDirLength;
        // left = up x direction
        let leftX, leftY, leftZ;
        leftX = upY * ndirZ - upZ * ndirY;
        leftY = upZ * ndirX - upX * ndirZ;
        leftZ = upX * ndirY - upY * ndirX;
        // normalize left
        const invLeftLength = 1 / Math.sqrt(leftX * leftX + leftY * leftY + leftZ * leftZ);
        leftX *= invLeftLength;
        leftY *= invLeftLength;
        leftZ *= invLeftLength;
        // up = direction x left
        const upnX = ndirY * leftZ - ndirZ * leftY;
        const upnY = ndirZ * leftX - ndirX * leftZ;
        const upnZ = ndirX * leftY - ndirY * leftX;
        this.m00 = leftX;
        this.m01 = leftY;
        this.m02 = leftZ;
        this.m03 = 0.0;
        this.m10 = upnX;
        this.m11 = upnY;
        this.m12 = upnZ;
        this.m13 = 0.0;
        this.m20 = ndirX;
        this.m21 = ndirY;
        this.m22 = ndirZ;
        this.m23 = 0.0;
        this.m30 = posX;
        this.m31 = posY;
        this.m32 = posZ;
        this.m33 = 1.0;
        // properties = PROPERTY_AFFINE | PROPERTY_ORTHONORMAL;
        return this;
    }

    public getEulerAnglesZYX(dest?: Vector3): Vector3 {
        dest.x = Math.atan2(this.m12, this.m22);
        dest.y = Math.atan2(-this.m02, Math.sqrt(1.0 - this.m02 * this.m02));
        dest.z = Math.atan2(this.m01, this.m00);
        return dest;
    }

    public getEulerAnglesXYZ(dest?: Vector3): Vector3 {
        dest = dest ?? new Vector3();
        dest.x = Math.atan2(-this.m21, this.m22);
        dest.y = Math.atan2(this.m20, Math.sqrt(1.0 - this.m20 * this.m20));
        dest.z = Math.atan2(-this.m10, this.m00);
        return dest;
    }

    /**
     * Compute the extents of the coordinate system before this {@link #isAffine() affine} transformation was applied
     * and store the resulting corner coordinates in <code>corner</code> and the span vectors in
     * <code>xDir</code>, <code>yDir</code> and <code>zDir</code>.
     * <p>
     * That means, given the maximum extents of the coordinate system between <code>[-1..+1]</code> in all dimensions,
     * this method returns one corner and the length and direction of the three base axis vectors in the coordinate
     * system before this transformation is applied, which transforms into the corner coordinates <code>[-1, +1]</code>.
     * <p>
     * This method is equivalent to computing at least three adjacent corners using {@link #frustumCorner(int, Vector3d)}
     * and subtracting them to obtain the length and direction of the span vectors.
     * 
     * @param corner
     *          will hold one corner of the span (usually the corner {@link Matrix4dc#CORNER_NXNYNZ})
     * @param xDir
     *          will hold the direction and length of the span along the positive X axis
     * @param yDir
     *          will hold the direction and length of the span along the positive Y axis
     * @param zDir
     *          will hold the direction and length of the span along the positive z axis
     * @return this
     */
    public affineSpan(corner: Vector3, xDir: Vector3, yDir: Vector3, zDir: Vector3): Matrix4 {
        const a = this.m10 * this.m22, b = this.m10 * this.m21, c = this.m10 * this.m02, d = this.m10 * this.m01;
        const e = this.m11 * this.m22, f = this.m11 * this.m20, g = this.m11 * this.m02, h = this.m11 * this.m00;
        const i = this.m12 * this.m21, j = this.m12 * this.m20, k = this.m12 * this.m01, l = this.m12 * this.m00;
        const m = this.m20 * this.m02, n = this.m20 * this.m01, o = this.m21 * this.m02, p = this.m21 * this.m00;
        const q = this.m22 * this.m01, r = this.m22 * this.m00;
        const s = 1.0 / (this.m00 * this.m11 - this.m01 * this.m10) * this.m22 +
            (this.m02 * this.m10 - this.m00 * this.m12) * this.m21 + (this.m01 * this.m12 - this.m02 * this.m11) * this.m20;

        const nm00 = (e - i) * s, nm01 = (o - q) * s, nm02 = (k - g) * s;
        const nm10 = (j - a) * s, nm11 = (r - m) * s, nm12 = (c - l) * s;
        const nm20 = (b - f) * s, nm21 = (n - p) * s, nm22 = (h - d) * s;
        corner.x = -nm00 - nm10 - nm20 + (a * this.m31 - b * this.m32 + f * this.m32 - e * this.m30 + i * this.m30 - j * this.m31) * s;
        corner.y = -nm01 - nm11 - nm21 + (m * this.m31 - n * this.m32 + p * this.m32 - o * this.m30 + q * this.m30 - r * this.m31) * s;
        corner.z = -nm02 - nm12 - nm22 + (g * this.m30 - k * this.m30 + l * this.m31 - c * this.m31 + d * this.m32 - h * this.m32) * s;
        xDir.x = 2.0 * nm00; xDir.y = 2.0 * nm01; xDir.z = 2.0 * nm02;
        yDir.x = 2.0 * nm10; yDir.y = 2.0 * nm11; yDir.z = 2.0 * nm12;
        zDir.x = 2.0 * nm20; zDir.y = 2.0 * nm21; zDir.z = 2.0 * nm22;
        return this;
    }

    public testPoint(x: number, y: number, z: number): boolean {
        const nxX = this.m03 + this.m00, nxY = this.m13 + this.m10, nxZ = this.m23 + this.m20, nxW = this.m33 + this.m30;
        const pxX = this.m03 - this.m00, pxY = this.m13 - this.m10, pxZ = this.m23 - this.m20, pxW = this.m33 - this.m30;
        const nyX = this.m03 + this.m01, nyY = this.m13 + this.m11, nyZ = this.m23 + this.m21, nyW = this.m33 + this.m31;
        const pyX = this.m03 - this.m01, pyY = this.m13 - this.m11, pyZ = this.m23 - this.m21, pyW = this.m33 - this.m31;
        const nzX = this.m03 + this.m02, nzY = this.m13 + this.m12, nzZ = this.m23 + this.m22, nzW = this.m33 + this.m32;
        const pzX = this.m03 - this.m02, pzY = this.m13 - this.m12, pzZ = this.m23 - this.m22, pzW = this.m33 - this.m32;
        return nxX * x + nxY * y + nxZ * z + nxW >= 0 && pxX * x + pxY * y + pxZ * z + pxW >= 0 &&
            nyX * x + nyY * y + nyZ * z + nyW >= 0 && pyX * x + pyY * y + pyZ * z + pyW >= 0 &&
            nzX * x + nzY * y + nzZ * z + nzW >= 0 && pzX * x + pzY * y + pzZ * z + pzW >= 0;
    }

    public testSphere(x: number, y: number, z: number, r: number): boolean {
        let invl;
        let nxX = this.m03 + this.m00, nxY = this.m13 + this.m10, nxZ = this.m23 + this.m20, nxW = this.m33 + this.m30;
        invl = 1 / Math.sqrt(nxX * nxX + nxY * nxY + nxZ * nxZ);
        nxX *= invl; nxY *= invl; nxZ *= invl; nxW *= invl;
        let pxX = this.m03 - this.m00, pxY = this.m13 - this.m10, pxZ = this.m23 - this.m20, pxW = this.m33 - this.m30;
        invl = 1 / Math.sqrt(pxX * pxX + pxY * pxY + pxZ * pxZ);
        pxX *= invl; pxY *= invl; pxZ *= invl; pxW *= invl;
        let nyX = this.m03 + this.m01, nyY = this.m13 + this.m11, nyZ = this.m23 + this.m21, nyW = this.m33 + this.m31;
        invl = 1 / Math.sqrt(nyX * nyX + nyY * nyY + nyZ * nyZ);
        nyX *= invl; nyY *= invl; nyZ *= invl; nyW *= invl;
        let pyX = this.m03 - this.m01, pyY = this.m13 - this.m11, pyZ = this.m23 - this.m21, pyW = this.m33 - this.m31;
        invl = 1 / Math.sqrt(pyX * pyX + pyY * pyY + pyZ * pyZ);
        pyX *= invl; pyY *= invl; pyZ *= invl; pyW *= invl;
        let nzX = this.m03 + this.m02, nzY = this.m13 + this.m12, nzZ = this.m23 + this.m22, nzW = this.m33 + this.m32;
        invl = 1 / Math.sqrt(nzX * nzX + nzY * nzY + nzZ * nzZ);
        nzX *= invl; nzY *= invl; nzZ *= invl; nzW *= invl;
        let pzX = this.m03 - this.m02, pzY = this.m13 - this.m12, pzZ = this.m23 - this.m22, pzW = this.m33 - this.m32;
        invl = 1 / Math.sqrt(pzX * pzX + pzY * pzY + pzZ * pzZ);
        pzX *= invl; pzY *= invl; pzZ *= invl; pzW *= invl;
        return nxX * x + nxY * y + nxZ * z + nxW >= -r && pxX * x + pxY * y + pxZ * z + pxW >= -r &&
            nyX * x + nyY * y + nyZ * z + nyW >= -r && pyX * x + pyY * y + pyZ * z + pyW >= -r &&
            nzX * x + nzY * y + nzZ * z + nzW >= -r && pzX * x + pzY * y + pzZ * z + pzW >= -r;
    }

    public testAab(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): boolean {
        const nxX = this.m03 + this.m00, nxY = this.m13 + this.m10, nxZ = this.m23 + this.m20, nxW = this.m33 + this.m30;
        const pxX = this.m03 - this.m00, pxY = this.m13 - this.m10, pxZ = this.m23 - this.m20, pxW = this.m33 - this.m30;
        const nyX = this.m03 + this.m01, nyY = this.m13 + this.m11, nyZ = this.m23 + this.m21, nyW = this.m33 + this.m31;
        const pyX = this.m03 - this.m01, pyY = this.m13 - this.m11, pyZ = this.m23 - this.m21, pyW = this.m33 - this.m31;
        const nzX = this.m03 + this.m02, nzY = this.m13 + this.m12, nzZ = this.m23 + this.m22, nzW = this.m33 + this.m32;
        const pzX = this.m03 - this.m02, pzY = this.m13 - this.m12, pzZ = this.m23 - this.m22, pzW = this.m33 - this.m32;
        /*
         * This is an implementation of the "2.4 Basic intersection test" of the mentioned site.
         * It does not distinguish between partially inside and fully inside, though, so the test with the 'p' vertex is omitted.
         */
        return (
            nxX * (nxX < 0 ? minX : maxX) + nxY * (nxY < 0 ? minY : maxY) + nxZ * (nxZ < 0 ? minZ : maxZ) >= -nxW &&
            pxX * (pxX < 0 ? minX : maxX) + pxY * (pxY < 0 ? minY : maxY) + pxZ * (pxZ < 0 ? minZ : maxZ) >= -pxW &&
            nyX * (nyX < 0 ? minX : maxX) + nyY * (nyY < 0 ? minY : maxY) + nyZ * (nyZ < 0 ? minZ : maxZ) >= -nyW &&
            pyX * (pyX < 0 ? minX : maxX) + pyY * (pyY < 0 ? minY : maxY) + pyZ * (pyZ < 0 ? minZ : maxZ) >= -pyW &&
            nzX * (nzX < 0 ? minX : maxX) + nzY * (nzY < 0 ? minY : maxY) + nzZ * (nzZ < 0 ? minZ : maxZ) >= -nzW &&
            pzX * (pzX < 0 ? minX : maxX) + pzY * (pzY < 0 ? minY : maxY) + pzZ * (pzZ < 0 ? minZ : maxZ) >= -pzW
        );
    }

    /**
     * Apply an oblique projection transformation to this matrix with the given values for <code>a</code> and
     * <code>b</code> and store the result in <code>dest</code>.
     * <p>
     * If <code>M</code> is <code>this</code> matrix and <code>O</code> the oblique transformation matrix,
     * then the new matrix will be <code>M * O</code>. So when transforming a
     * vector <code>v</code> with the new matrix by using <code>M * O * v</code>, the
     * oblique transformation will be applied first!
     * <p>
     * The oblique transformation is defined as:
     * <pre>
     * x' = x + a*z
     * y' = y + a*z
     * z' = z
     * </pre>
     * or in matrix form:
     * <pre>
     * 1 0 a 0
     * 0 1 b 0
     * 0 0 1 0
     * 0 0 0 1
     * </pre>
     * 
     * @param a
     *            the value for the z factor that applies to x
     * @param b
     *            the value for the z factor that applies to y
     * @param dest
     *            will hold the result
     * @return dest
     */
    public obliqueZ(a: number, b: number, dest?: Matrix4): Matrix4 {
        dest.set(
            this.m00, this.m01, this.m02, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            this.m00 * a + this.m10 * b + this.m20, // 2 0
            this.m01 * a + this.m11 * b + this.m21, // 2 1
            this.m02 * a + this.m12 * b + this.m22, // 2 2
            this.m23,                                   // 2 3
            this.m30, this.m31, this.m32, this.m33,
        )
        // dest._properties(properties & PROPERTY_AFFINE);
        return dest;
    }

    /**
     * Create a view and projection matrix from a given <code>eye</code> position, a given bottom left corner position <code>p</code> of the near plane rectangle
     * and the extents of the near plane rectangle along its local <code>x</code> and <code>y</code> axes, and store the resulting matrices
     * in <code>projDest</code> and <code>viewDest</code>.
     * <p>
     * This method creates a view and perspective projection matrix assuming that there is a pinhole camera at position <code>eye</code>
     * projecting the scene onto the near plane defined by the rectangle.
     * <p>
     * All positions and lengths are in the same (world) unit.
     * 
     * @param eye
     *          the position of the camera
     * @param p
     *          the bottom left corner of the near plane rectangle (will map to the bottom left corner in window coordinates)
     * @param x
     *          the direction and length of the local "bottom/top" X axis/side of the near plane rectangle
     * @param y
     *          the direction and length of the local "left/right" Y axis/side of the near plane rectangle
     * @param nearFarDist
     *          the distance between the far and near plane (the near plane will be calculated by this method).
     *          If the special value {@link Double#POSITIVE_INFINITY} is used, the far clipping plane will be at positive infinity.
     *          If the special value {@link Double#NEGATIVE_INFINITY} is used, the near and far planes will be swapped and 
     *          the near clipping plane will be at positive infinity.
     *          If a negative value is used (except for {@link Double#NEGATIVE_INFINITY}) the near and far planes will be swapped
     * @param zeroToOne
     *          whether to use Vulkan's and Direct3D's NDC z range of <code>[0..+1]</code> when <code>true</code>
     *          or whether to use OpenGL's NDC z range of <code>[-1..+1]</code> when <code>false</code>
     * @param projDest
     *          will hold the resulting projection matrix
     * @param viewDest
     *          will hold the resulting view matrix
     */
    public static projViewFromRectangle(
        eye: Vector3, p: Vector3, x: Vector3, y: Vector3, nearFarDist: number, zeroToOne: boolean,
        projDest: Matrix4, viewDest: Matrix4): void {
        let zx = y.y * x.z - y.z * x.y, zy = y.z * x.x - y.x * x.z, zz = y.x * x.y - y.y * x.x;
        let zd = zx * (p.x - eye.x) + zy * (p.y - eye.y) + zz * (p.z - eye.z);
        const zs = zd >= 0 ? 1 : -1;
        zx *= zs; zy *= zs; zz *= zs; zd *= zs;
        viewDest.setLookAt(eye.x, eye.y, eye.z, eye.x + zx, eye.y + zy, eye.z + zz, y.x, y.y, y.z);
        const px = viewDest.m00 * p.x + viewDest.m10 * p.y + viewDest.m20 * p.z + viewDest.m30;
        const py = viewDest.m01 * p.x + viewDest.m11 * p.y + viewDest.m21 * p.z + viewDest.m31;
        const tx = viewDest.m00 * x.x + viewDest.m10 * x.y + viewDest.m20 * x.z;
        const ty = viewDest.m01 * y.x + viewDest.m11 * y.y + viewDest.m21 * y.z;
        const len = Math.sqrt(zx * zx + zy * zy + zz * zz);
        let near = zd / len, far;
        isFinite
        if (!isFinite(nearFarDist) && nearFarDist < 0.0) {
            far = near;
            near = Infinity;
        } else if (!isFinite(nearFarDist) && nearFarDist > 0.0) {
            far = Infinity;
        } else if (nearFarDist < 0.0) {
            far = near;
            near = near + nearFarDist;
        } else {
            far = near + nearFarDist;
        }
        projDest.setFrustum(px, px + tx, py, py + ty, near, far, zeroToOne);
    }

    /**
     * Apply a transformation to this matrix to ensure that the local Y axis (as obtained by {@link #positiveY(Vector3d)})
     * will be coplanar to the plane spanned by the local Z axis (as obtained by {@link #positiveZ(Vector3d)}) and the
     * given vector <code>up</code>.
     * <p>
     * This effectively ensures that the resulting matrix will be equal to the one obtained from 
     * {@link #setLookAt(Vector3dc, Vector3dc, Vector3dc)} called with the current 
     * local origin of this matrix (as obtained by {@link #originAffine(Vector3d)}), the sum of this position and the 
     * negated local Z axis as well as the given vector <code>up</code>.
     * <p>
     * This method must only be called on {@link #isAffine()} matrices.
     * 
     * @param up
     *            the up vector
     * @return this
     */
    public withLookAtUp(up: Vector3, dest?: Matrix4): Matrix4;
    /**
     * Apply a transformation to this matrix to ensure that the local Y axis (as obtained by {@link #positiveY(Vector3d)})
     * will be coplanar to the plane spanned by the local Z axis (as obtained by {@link #positiveZ(Vector3d)}) and the
     * given vector <code>(upX, upY, upZ)</code>.
     * <p>
     * This effectively ensures that the resulting matrix will be equal to the one obtained from 
     * {@link #setLookAt(double, double, double, double, double, double, double, double, double)} called with the current 
     * local origin of this matrix (as obtained by {@link #originAffine(Vector3d)}), the sum of this position and the 
     * negated local Z axis as well as the given vector <code>(upX, upY, upZ)</code>.
     * <p>
     * This method must only be called on {@link #isAffine()} matrices.
     * 
     * @param upX
     *            the x coordinate of the up vector
     * @param upY
     *            the y coordinate of the up vector
     * @param upZ
     *            the z coordinate of the up vector
     * @return dest
     */
    public withLookAtUp(upX: number, upY: number, upZ: number, dest?: Matrix4): Matrix4;
    public withLookAtUp(upX: number | Vector3, upY?: number | Matrix4, upZ?: number, dest?: Matrix4): Matrix4 {
        dest = dest ?? (upY instanceof Matrix4 ? upY : this);
        upY = upY as number;
        if (upX instanceof Vector3) {
            upZ = upX.z, upY = upX.y, upX = upX.x;
        }

        const y =
            (upY * this.m21 - upZ * this.m11) * this.m02 +
            (upZ * this.m01 - upX * this.m21) * this.m12 +
            (upX * this.m11 - upY * this.m01) * this.m22;

        let x = upX * this.m01 + upY * this.m11 + upZ * this.m21;
        if (!this.PROPERTY_ORTHONORMAL) {
            x *= Math.sqrt(this.m01 * this.m01 + this.m11 * this.m11 + this.m21 * this.m21);
        }

        const invsqrt = 1 / Math.sqrt(y * y + x * x);
        const c = x * invsqrt, s = y * invsqrt;
        return dest.set(
            c * this.m00 - s * this.m01, s * this.m00 + c * this.m01, this.m02, this.m03,
            c * this.m10 - s * this.m11, s * this.m10 + c * this.m11, this.m22, this.m13,
            c * this.m20 - s * this.m21, s * this.m20 + c * this.m21, this.m12, this.m23,
            c * this.m30 - s * this.m31, s * this.m30 + c * this.m31, this.m32, this.m33,
        )
    }


    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1 0 0 0
     * 0 0 1 0
     * 0 1 0 0
     * 0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapXZY(dest?: Matrix4): Matrix4 {
        const m10 = this.m10, m11 = this.m11, m12 = this.m12;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1 0  0 0
     * 0 0 -1 0
     * 0 1  0 0
     * 0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapXZnY(dest?: Matrix4): Matrix4 {
        const m10 = this.m10, m11 = this.m11, m12 = this.m12;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1  0  0 0
     * 0 -1  0 0
     * 0  0 -1 0
     * 0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapXnYnZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1  0 0 0
     * 0  0 1 0
     * 0 -1 0 0
     * 0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapXnZY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1  0  0 0
     * 0  0 -1 0
     * 0 -1  0 0
     * 0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapXnZnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 1 0 0
     * 1 0 0 0
     * 0 0 1 0
     * 0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapYXZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 1  0 0
     * 1 0  0 0
     * 0 0 -1 0
     * 0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 0 1 0
     * 1 0 0 0
     * 0 1 0 0
     * 0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapYZX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 0 -1 0
     * 1 0  0 0
     * 0 1  0 0
     * 0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapYZnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 -1 0 0
     * 1  0 0 0
     * 0  0 1 0
     * 0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapYnXZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 -1  0 0
     * 1  0  0 0
     * 0  0 -1 0
     * 0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapYnXnZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0  0 1 0
     * 1  0 0 0
     * 0 -1 0 0
     * 0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapYnZX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0  0 -1 0
     * 1  0  0 0
     * 0 -1  0 0
     * 0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapYnZnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m10, this.m11, this.m12, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 1 0 0
     * 0 0 1 0
     * 1 0 0 0
     * 0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapZXY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 1  0 0
     * 0 0 -1 0
     * 1 0  0 0
     * 0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapZXnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 0 1 0
     * 0 1 0 0
     * 1 0 0 0
     * 0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapZYX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 0 -1 0
     * 0 1  0 0
     * 1 0  0 0
     * 0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapZYnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 -1 0 0
     * 0  0 1 0
     * 1  0 0 0
     * 0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapZnXY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0 -1  0 0
     * 0  0 -1 0
     * 1  0  0 0
     * 0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapZnXnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0  0 1 0
     * 0 -1 0 0
     * 1  0 0 0
     * 0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapZnYX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 0  0 -1 0
     * 0 -1  0 0
     * 1  0  0 0
     * 0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapZnYnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m20, this.m21, this.m22, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1 0  0 0
     *  0 1  0 0
     *  0 0 -1 0
     *  0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXYnZ(dest?: Matrix4): Matrix4 {
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1 0 0 0
     *  0 0 1 0
     *  0 1 0 0
     *  0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXZY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1 0  0 0
     *  0 0 -1 0
     *  0 1  0 0
     *  0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXZnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1  0 0 0
     *  0 -1 0 0
     *  0  0 1 0
     *  0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXnYZ(dest?: Matrix4): Matrix4 {
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1  0  0 0
     *  0 -1  0 0
     *  0  0 -1 0
     *  0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXnYnZ(dest?: Matrix4): Matrix4 {
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1  0 0 0
     *  0  0 1 0
     *  0 -1 0 0
     *  0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXnZY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1  0  0 0
     *  0  0 -1 0
     *  0 -1  0 0
     *  0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnXnZnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 1 0 0
     * -1 0 0 0
     *  0 0 1 0
     *  0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYXZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 1  0 0
     * -1 0  0 0
     *  0 0 -1 0
     *  0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYXnZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 0 1 0
     * -1 0 0 0
     *  0 1 0 0
     *  0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYZX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 0 -1 0
     * -1 0  0 0
     *  0 1  0 0
     *  0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYZnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            this.m20, this.m21, this.m22, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 -1 0 0
     * -1  0 0 0
     *  0  0 1 0
     *  0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYnXZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 -1  0 0
     * -1  0  0 0
     *  0  0 -1 0
     *  0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYnXnZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0  0 1 0
     * -1  0 0 0
     *  0 -1 0 0
     *  0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYnZX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0  0 -1 0
     * -1  0  0 0
     *  0 -1  0 0
     *  0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnYnZnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m10, -this.m11, -this.m12, this.m03,
            -this.m20, -this.m21, -this.m22, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 1 0 0
     *  0 0 1 0
     * -1 0 0 0
     *  0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZXY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 1  0 0
     *  0 0 -1 0
     * -1 0  0 0
     *  0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZXnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            this.m00, this.m01, this.m02, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 0 1 0
     *  0 1 0 0
     * -1 0 0 0
     *  0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZYX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 0 -1 0
     *  0 1  0 0
     * -1 0  0 0
     *  0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZYnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 -1 0 0
     *  0  0 1 0
     * -1  0 0 0
     *  0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZnXY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            this.m10, this.m11, this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0 -1  0 0
     *  0  0 -1 0
     * -1  0  0 0
     *  0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZnXnY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            -this.m00, -this.m01, -this.m02, this.m13,
            -this.m10, -this.m11, -this.m12, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0  0 1 0
     *  0 -1 0 0
     * -1  0 0 0
     *  0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZnYX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            this.m00, this.m01, this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }
    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     *  0  0 -1 0
     *  0 -1  0 0
     * -1  0  0 0
     *  0  0  0 1
     * </pre>
     * 
     * @return this
     */
    public mapnZnYnX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m20, -this.m21, -this.m22, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            -this.m00, -this.m01, -this.m02, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }

    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * -1 0 0 0
     *  0 1 0 0
     *  0 0 1 0
     *  0 0 0 1
     * </pre>
     * 
     * @return this
     */
    public negateX(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            -this.m00, -this.m01, -this.m02, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }

    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1  0 0 0
     * 0 -1 0 0
     * 0  0 1 0
     * 0  0 0 1
     * </pre>
     * 
     * @return this
     */
    public negateY(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            -this.m10, -this.m11, -this.m12, this.m13,
            this.m20, this.m21, this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }

    /**
     * Multiply <code>this</code> by the matrix
     * <pre>
     * 1 0  0 0
     * 0 1  0 0
     * 0 0 -1 0
     * 0 0  0 1
     * </pre>
     * 
     * @return this
     */
    public negateZ(dest?: Matrix4): Matrix4 {
        dest = dest ?? this;
        return dest.set(
            this.m00, this.m01, this.m02, this.m03,
            this.m10, this.m11, this.m12, this.m13,
            -this.m20, -this.m21, -this.m22, this.m23,
            this.m30, this.m31, this.m32, this.m33
        );
    }

    public isFinite(): boolean {
        return isFinite(this.m00) && isFinite(this.m01) && isFinite(this.m02) && isFinite(this.m03)
            && isFinite(this.m10) && isFinite(this.m11) && isFinite(this.m12) && isFinite(this.m13)
            && isFinite(this.m20) && isFinite(this.m21) && isFinite(this.m22) && isFinite(this.m23)
            && isFinite(this.m30) && isFinite(this.m31) && isFinite(this.m32) && isFinite(this.m33);
    }

    public clone(): Matrix4 {
        return new Matrix4(this);
    }
}
