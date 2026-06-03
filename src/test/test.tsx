/**
 * test.tsx
 *
 * Dev-mode entry point. Import the components you want to test and render
 * them below. Run `npm run dev` to start the dev server.
 */
// @refresh reset


import React, { type FC } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { Dropdown } from '../components/Dropdown';

interface Props {

}

const CustomElement: FC<Props> = ({

}) => {
  const [selected, setSelected] = React.useState<string | number>(0);
  return (
    <div style={{ padding: 20, gap: 40, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <h2>Dropdown</h2>
      <Dropdown
        width={300}
        selectedId={selected}
        options={[
          { id: 1, value: 'Apple' },
          { id: 2, value: 'Banana' },
          { id: 3, value: 'Cherry' },
        ]}
        onSelect={(option) => setSelected(option.id)}
        placeHolder="Pick a fruit…"
        triggerStyle={{
          background: '#1a1a2e',
          text: { color: '#fff', font: 'bold 14px/1 Arial' },
          border: { color: '#4a90e2', width: 2, radius: 8 },
          icon: { color: '#4a90e2' },
        }}
        listStyle={{
          background: '#16213e',
          border: { color: '#4a90e2', width: 2, radius: 8 },
          text: { color: '#eee' },
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          hover: { background: '#4a90e2', color: '#fff' },
          selected: { background: '#357abd', color: '#fff' },
        }}
      />

      <Dropdown
        width={300}
        selectedId={selected}
        options={[
          { id: 1, value: 'Apple' },
          { id: 2, value: 'Banana' },
          { id: 3, value: 'Cherry' },
        ]}
        onSelect={(option) => setSelected(option.id)}
        placeHolder="Pick a fruit…"
      />
    </div>
  );
};

const CustomElementClass = reactToWebComponent(
  CustomElement,
  React,
  ReactDOM as any,
  { props: {} }
);

if (!customElements.get('dev-preview')) {
  customElements.define('dev-preview', CustomElementClass);
}

const root = document.getElementById('root')!;
if (!root.querySelector('dev-preview')) {
  root.appendChild(document.createElement('dev-preview'));
}
