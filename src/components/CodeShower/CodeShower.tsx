import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Box, Heading, TextButton } from '@wix/design-system';

import { CodeShowerProps } from './CodeShower.types';
import { useCodeShower } from './useCodeShower';
import './component.css';

export const CodeShower = React.forwardRef<HTMLDivElement, CodeShowerProps>(({ 
    code, 
    title 
}, ref) => {
    const { widgetCodeCopy, handleCopyCode } = useCodeShower(code);
    return (
        <Box direction='vertical' gap={'10px'} width={'100%'} ref={ref}>
            <Box align='center' direction='horizontal' WebkitJustifyContent='space-between' verticalAlign='middle'>
                <Heading>{title}</Heading>
                <TextButton size='small' onClick={handleCopyCode}>
                    {widgetCodeCopy ? 'Code Copied!' : 'Copy Code'}
                </TextButton>
            </Box>
            <Highlight theme={themes.vsDark} code={code} language="tsx">
                {({ style, tokens, getLineProps, getTokenProps }) => (
                    <pre style={{ ...style, margin: 0, padding: '12px', fontFamily: 'monospace', fontSize: '13px', overflowX: 'auto', overflowY: 'auto', width: '100%', height: '100%', boxSizing: 'border-box' }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </Box>
    )
});

CodeShower.displayName = 'CodeShower';