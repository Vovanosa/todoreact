import { FunctionComponent } from 'react';
import styles from './InputText.module.scss';

interface InputTextProps {
  focus: boolean;
  inputText: string;
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputText: FunctionComponent<InputTextProps> = (props) => {
  const { focus, inputText, id, value, onChange, onKeyDown } = props;

  return (
    <input
      autoFocus={focus}
      style={styles}
      type='text'
      id={id}
      placeholder={inputText}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    ></input>
  );
};

export default InputText;
