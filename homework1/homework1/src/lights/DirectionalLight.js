class DirectionalLight {

    constructor(lightIntensity, lightColor, lightPos, focalPoint, lightUp, hasShadowMap, gl) {
        this.mesh = Mesh.cube(setTransform(0, 0, 0, 0.2, 0.2, 0.2, 0));
        this.mat = new EmissiveMaterial(lightIntensity, lightColor);
        this.lightPos = lightPos;
        this.focalPoint = focalPoint;
        this.lightUp = lightUp

        this.hasShadowMap = hasShadowMap;
        this.fbo = new FBO(gl);
        if (!this.fbo) {
            console.log("无法设置帧缓冲区对象");
            return;
        }
    }

    CalcLightMVP(translate, scale) {
        let lightMVP = mat4.create();
        let modelMatrix = mat4.create();
        let viewMatrix = mat4.create();
        let projectionMatrix = mat4.create();

        // Model transform
        mat4.translate(modelMatrix, modelMatrix, translate);
        mat4.scale(modelMatrix, modelMatrix, scale);
        // View transform
        // mat4.targetTo doesn't return view matrix directly. The result need to be inverted to get view matrix.
        mat4.targetTo(viewMatrix, this.lightPos, this.focalPoint, this.lightUp);
        mat4.invert(viewMatrix, viewMatrix);
        // Projection transform
        // mat4.ortho maps [left, bottom, -near] to [-1, -1, -1], [right, top, -far] to [1, 1, 1].
        // The near and far parameters usually are positive values.
        mat4.ortho(projectionMatrix, -150, 150, -100, 150, 0, 250);

        mat4.multiply(lightMVP, projectionMatrix, viewMatrix);
        mat4.multiply(lightMVP, lightMVP, modelMatrix);

        return lightMVP;
    }
}
