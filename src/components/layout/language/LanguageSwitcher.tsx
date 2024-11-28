import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Correct path to store if needed
import { setLanguage } from '../features/language/languageSlice';

const LanguageSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value));
  };

  return (
    <div>
      <label htmlFor="language-select">Choose Language: </label>
      <select
        id="language-select"
        value={language}
        onChange={handleChange}
        style={{ marginLeft: '0.5rem' }}
      >
        <option value="en">English</option>
        <option value="fa">فارسی</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
