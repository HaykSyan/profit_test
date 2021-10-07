/* eslint @typescript-eslint/no-use-before-define: 0 */
import React, { useState } from "react";
import block from "bem-cn-lite";
import "./TakeProfit.scss";
import { IconButton } from "@material-ui/core";
import HelpIcon from '@material-ui/icons/Help';
import { NumberInput, Switch } from "components";
import Cancel from "@material-ui/icons/Cancel";
import { QUOTE_CURRENCY } from "PlaceOrder/constants";
import { AddRounded } from "@material-ui/icons";
import { observer } from "mobx-react";
import { useStore } from "PlaceOrder/context";

const b = block("take-profit");

const TakeProfit = observer(() => {
  const {
    projected_profit,
    profit,
    setProfitRow, 
    removeProfitRow,
    handleProfitItems,
    sumProfits,
  } = useStore();
  const [switchOn, setSwitchOn] = useState(false);
  return <div className={b('section')}>
    <div className={b('header')}>
      <div>
        Take Profit 
        <IconButton className={b('help-icon')}>
          <HelpIcon fontSize="small" />
        </IconButton>
      </div>
      <Switch
        checked={switchOn}
        onChange={() => setSwitchOn(!switchOn)}
      />
    </div>
    { switchOn ?
      <div>
        {profit.map((p, index) => (<div className={b('body')} key={index}>
          <div>
            <NumberInput
              variant="underlined"
              label="Profit"
              error={p.profit < 0.01?"Minimum value is 0.01":""}
              value={p.profit}
              onChange={(value) => handleProfitItems(index, {profit: Number(value)})}
              InputProps={{ endAdornment: "%" }}
            />
          </div>
          <div>
            <NumberInput
              variant="underlined"
              label="Target price"
              value={p.target_price}
              error={!p.target_price? "Price must be greater than 0": ""}
              onChange={(value) => handleProfitItems(index, {target_price: Number(value)})}
              InputProps={{ endAdornment: QUOTE_CURRENCY }}
            />
          </div>
          <div>
            <NumberInput
              variant="underlined"
              label="Amount to by"
              value={p.amount_to_by}
              onChange={(value) => handleProfitItems(index, {amount_to_by: Number(value)})}
              InputProps={{ endAdornment: "%" }}
              onBlur={() => sumProfits()}
            />
          </div>
          <div>
            <IconButton className={b('remove-icon')} onClick={() => removeProfitRow(index)}>
              <Cancel />
            </IconButton>
          </div>
        </div>
        ))}
        {profit.length < 5? <p className={b('add-row')} onClick={() => setProfitRow()}>
          <IconButton className={b('add-icon')} >
            <AddRounded style={{fontSize: 15}} />
          </IconButton> <span>Add profit target {profit.length} / 5</span>
        </p>: null}
      </div>
    : null}
    <div className={b('footer')}>
      <div>
        Projected profit
      </div>
      <div><span>{projected_profit}</span> {QUOTE_CURRENCY}</div>
    </div>
  </div>;
});

export { TakeProfit };
