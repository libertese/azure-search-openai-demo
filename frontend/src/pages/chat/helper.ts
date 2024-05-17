export const loadScript = (src: any) =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Erro ao carregar o script: ${src}`));
    };

    document.body.appendChild(script);
  });