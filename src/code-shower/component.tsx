import React, { type FC } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Box, Heading, TextButton } from '@wix/design-system';

import { ComponentProps } from './component.types';
import './component.css';

const CodeShower: React.FC<ComponentProps> = ({ code, title }) => {
    const [widgetCodeCopy, setWidgetCodeCopy] = React.useState(false);
    return (
        <Box direction='vertical' gap={'10px'} width={'100%'}>
            <Box align='center' direction='horizontal' WebkitJustifyContent='space-between' verticalAlign='middle'>
                <Heading>{title}</Heading>
                <TextButton size='small' onClick={() => {
                    navigator.clipboard.writeText(code).then(() => {
                        setWidgetCodeCopy(true);
                        setTimeout(() => setWidgetCodeCopy(false), 2000);
                    }).catch(err => {
                        console.error('Failed to copy code: ', err);
                    });
                }}>
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
}

export default CodeShower;