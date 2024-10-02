export const darken = (darkenAmount: number, originalColor: string) => {

  // Parse the hex color to RGB components
  const r = parseInt(originalColor.slice(1, 3), 16);
  const g = parseInt(originalColor.slice(3, 5), 16);
  const b = parseInt(originalColor.slice(5, 7), 16);

  // Calculate the darkened color by reducing each RGB component
  const darkenedColor = `rgb(${Math.max(r - darkenAmount, 0)}, ${Math.max(g - darkenAmount, 0)}, ${Math.max(b - darkenAmount, 0)})`;

  // Convert back to hex
  return `#${darkenedColor.slice(4, -1).split(',').map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`;
}

export const formatCurrency = (number: any) => {
  const parts = parseFloat(number?.toString() || 0).toFixed(2).toString().split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `$${integerPart}.${parts[1]}`;
}

export const filterNestedKeys = (obj: any, keys: string[]): any => {
  const result: any = {};

  keys.forEach((key) => {
    const keyParts = key.split('.');
    let current = result;
    let src = obj;

    keyParts.forEach((part, index) => {
      if (src && src[part] !== undefined) {
        if (index === keyParts.length - 1) {
          current[part] = src[part];
        } else {
          current[part] = current[part] || {};
          current = current[part];
          src = src[part];
        }
      }
    });
  });

  return result;
};