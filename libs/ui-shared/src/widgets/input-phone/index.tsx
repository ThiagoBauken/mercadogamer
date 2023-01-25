import { useState } from 'react';
import countriesData from 'country-telephone-data';
import { WrapLabel } from '@widgets/wrap-label';
import { Menu } from '@widgets/menu';
import { Icon } from '@widgets/icon';

export const InputPhone: React.FC<InputPhoneProps> = ({ phone, onChange, ...wrapLabelProps }) => {
  const [phoneNumber, setPhoneNumber] = useState<{ dialCode: string; phoneNumber: string }>({
    dialCode: '',
    phoneNumber: '',
  });

  const getCountryCode = (): string =>
    countriesData.allCountries.find((country) => country.dialCode === phoneNumber.dialCode)?.iso2;

  const onChangePhoneNumber = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const temp = event.target.value;
    /\d+/.test(temp) || temp === ''
      ? setPhoneNumber({ ...phoneNumber, phoneNumber: temp })
      : event.preventDefault();
  };
  return (
    <WrapLabel {...wrapLabelProps} className="mercado-input-phone" width="100%">
      <Menu
        onChange={(value) => {
          setPhoneNumber({ ...phoneNumber, dialCode: value as string });
          onChange(`+${value}${phoneNumber.phoneNumber}`);
        }}
        activator={
          <div className="select-country">
            <div
              className="icon"
              style={{ backgroundImage: `url(https://flagcdn.com/w40/${getCountryCode()}.png)` }}
            ></div>
            <div className="drop-icon">
              <Icon name="chevron-down" />
            </div>
          </div>
        }
        menuItems={countriesData.allCountries.map((country) => ({
          label: country.name,
          value: country.dialCode,
        }))}
      />

      <div className="phone-number">
        <div className="dial-code">{`+${phoneNumber.dialCode}`}</div>
        <input
          value={phoneNumber.phoneNumber}
          onChange={onChangePhoneNumber}
          onBlur={() => onChange(`+${phoneNumber.dialCode}${phoneNumber.phoneNumber}`)}
        />
      </div>
    </WrapLabel>
  );
};
