import THREE from './Three';
export default class ExpoTextureLoader extends THREE.TextureLoader {
    load(asset: any, onLoad: any, onProgress: any, onError: any): THREE.Texture;
}
