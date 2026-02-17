interface Window {
  turnstile: {
    render: (
      element: HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
      }
    ) => number;
    remove: (widgetId: number) => void;
  };
} 