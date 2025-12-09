import * as file from "@testing-library/user-event/dist/type";

export const FILTER_OPTIONS = [
    { name: 'Original', filter: 'none' },
    { name: 'Vivid', filter: 'saturate(150%) contrast(120%)'},
    { name: 'Dramatic', filter: 'contrast(140%) brightness(95%) sepia(10%)'},
    { name: 'Warm Tone', filter: 'sepia(25%) saturate(130%) brightness(108%)'},
    { name: 'Cool Tone', filter: 'hue-rotate(200deg) saturate(110%) brightness(100%)'},
    { name: 'Grayscale', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(60%)' },
    { name: 'Warm', filter: 'sepia(30%) saturate(140%)' },
    { name: 'Cool', filter: 'hue-rotate(180deg) saturate(80%)' },
    { name: 'Brightness', filter: 'brightness(120%) contrast(110%)' },
    { name: 'Vintage', filter: 'sepia(40%) contrast(120%) saturate(80%)' },
];

/**
 * 원본 이미지 파일에 CSS 필터를 적용하여 새로운 파일로 변환한다.
 * @param originalFile      원본 이미지 파일
 * @param filter            적용할 CSS 필터 문자열
 * @returns {Promise<File>} 필터 적용된 새로운 File 객체
 */
export const getFilteredFile = async (originalFile, filter, filterName) => {
    if(!filter || filter === 'none') return Promise.resolve(originalFile);
    const img = new Image();
    const url = URL.createObjectURL(originalFile);
    img.src = url;

    const originalName = originalFile.name;
    const lastDotIndex = originalName.lastIndexOf('.');
    const originalNameWithoutExtension = lastDotIndex === -1 ? originalName : originalName.substring(0, lastDotIndex);
    const extension = lastDotIndex === -1 ? '' : originalName.substring(lastDotIndex);
    const fileNameWithFilterNameAndExtension = `${originalNameWithoutExtension}_${filterName || 'filtered'}${extension}`;

    try {
        await img.decode();         // 이미지 로드 대기
        URL.revokeObjectURL(url);   // 메모리 해제
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(new File(
                    [blob],
                    fileNameWithFilterNameAndExtension,
                    {
                    type: originalFile.type,
                    lasModified: new Date()
                    }
                ));
            }, originalFile.type,
                1);
        })
    } catch (e) {
        console.log(e);
        return originalFile;
    }
}