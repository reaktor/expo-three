import { resolveAsync } from 'expo-asset-utils';
import { Image, Platform } from 'react-native';
import THREE from './Three';
async function requestImageSizesAsync(url) {
    return new Promise(resolve => {
        Image.getSize(url, (width, height) => {
            resolve({ width, height });
        }, error => {
            console.warn(error);
            resolve({ width: null, height: null });
        });
    });
}
export default class ExpoTextureLoader extends THREE.TextureLoader {
    load(asset, onLoad, onProgress, onError) {
        if (!asset) {
            throw new Error('ExpoTHREE.TextureLoader.load(): Cannot parse a null asset');
        }
        const texture = new THREE.Texture();
        const loader = new THREE.ImageLoader(this.manager);
        loader.setCrossOrigin(this.crossOrigin);
        loader.setPath(this.path);
        (async () => {
            const nativeAsset = await resolveAsync(asset);
            function parseAsset(image) {
                texture.image = image;
                texture.needsUpdate = true;
                if (onLoad !== undefined) {
                    onLoad(texture);
                }
            }
            if (Platform.OS === 'web') {
                loader.load(nativeAsset.localUri, image => {
                    parseAsset(image);
                }, onProgress, onError);
            }
            else {
                if (nativeAsset.localUri &&
                    nativeAsset.localUri.match(/\.(jpeg|jpg|gif|png)$/) &&
                    (!nativeAsset.width || !nativeAsset.height)) {
                    const { width, height } = await requestImageSizesAsync(nativeAsset.localUri);
                    nativeAsset.width = width;
                    nativeAsset.height = height;
                }
                texture['isDataTexture'] = true; // Forces passing to `gl.texImage2D(...)` verbatim
                parseAsset({
                    data: nativeAsset,
                    width: asset.width || nativeAsset.width,
                    height: asset.height || nativeAsset.height,
                });
            }
        })();
        return texture;
    }
}
//# sourceMappingURL=TextureLoader.js.map
//# sourceMappingURL=TextureLoader.js.map