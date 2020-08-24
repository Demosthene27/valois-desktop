import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getDynamicBaseFees } from '../../../../utils/api/transactions';

const useProcessingSpeed = () => {
  const { t } = useTranslation();
  const { token } = useSelector(state => state.settings);
  const [error, setError] = useState(false);
  const [baseFees, setBaseFees] = useState({
    Low: 0,
    Medium: 0,
    High: 0,
  });

  useEffect(() => {
    getDynamicBaseFees(token.active)
      .then(setBaseFees)
      .catch(setError);
  }, []);

  const [processingSpeedState, setProcessingSpeedState] = useState({
    value: 0,
    selectedIndex: 0,
  });

  const selectProcessingSpeed = ({ item, index }) => {
    setProcessingSpeedState({
      ...item,
      selectedIndex: index,
      error: !!error,
    });
  };

  const feeOptions = [
    { title: t('Low'), value: baseFees.Low },
    { title: t('Medium'), value: baseFees.Medium },
    { title: t('High'), value: baseFees.High },
  ];

  useEffect(() => {
    selectProcessingSpeed({
      item: feeOptions[processingSpeedState.selectedIndex],
      index: processingSpeedState.selectedIndex,
    });
  }, [processingSpeedState.index, baseFees]);

  return [processingSpeedState, selectProcessingSpeed, feeOptions];
};

export default useProcessingSpeed;
