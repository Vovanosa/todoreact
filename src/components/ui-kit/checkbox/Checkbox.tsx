import { FunctionComponent } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps {
  isChecked: boolean;
  onChange: () => void;
  children?: string;
}

const Checkbox: FunctionComponent<CheckboxProps> = (props) => {
  const { isChecked, onChange, children } = props;

  return (
    <>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={onChange}
        style={styles}
      />
      {children}
    </>
  );
};

export default Checkbox;
