import { useCallback, useEffect, useRef, useState } from 'react';

export const useCodeShower = (code: string) => {
	const [widgetCodeCopy, setWidgetCodeCopy] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleCopyCode = useCallback(() => {
		navigator.clipboard
			.writeText(code)
			.then(() => {
				setWidgetCodeCopy(true);

				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					setWidgetCodeCopy(false);
				}, 2000);
			})
			.catch((err) => {
				console.error('Failed to copy code: ', err);
			});
	}, [code]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return {
		widgetCodeCopy,
		handleCopyCode,
	};
};
