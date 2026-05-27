export const keypadGroups = [
  {
    title: 'Controls',
    hint: 'Clear, delete, evaluate',
    columns: 'grid-cols-3',
    buttons: [
      { label: 'C', value: 'C', variant: 'danger' },
      { label: 'DEL', value: 'DEL', variant: 'danger' },
      { label: '=', value: '=', variant: 'accent' },
    ],
  },
  {
    title: 'Operators',
    buttons: [
      { label: '^', value: '^', variant: 'primary' },
      { label: '%', value: '%', variant: 'primary' },
      { label: '(', value: '(', variant: 'primary' },
      { label: ')', value: ')', variant: 'primary' },
      { label: '/', value: '/', variant: 'primary' },
      { label: '*', value: '*', variant: 'primary' },
      { label: '-', value: '-', variant: 'primary' },
      { label: '+', value: '+', variant: 'primary' },
      { label: '!', value: '!', variant: 'primary' },
    ],
  },
  {
    title: 'Numbers',
    buttons: [
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '0', value: '0' },
      { label: '.', value: '.', variant: 'primary' },
      { label: 'π', value: 'π', variant: 'accent' },
    ],
  },
];
