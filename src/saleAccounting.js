function number(value){const parsed=Number(value);return Number.isFinite(parsed)?parsed:0}
function hasValue(value){return value!==undefined&&value!==null&&value!==''}

export function phoneSaleDisplayValue(phone){
 const sale=phone?.sale;
 if(sale?.soldAt&&hasValue(sale.value))return number(sale.value);
 return number(phone?.expected);
}

export function syncRecordedSaleValue(phone,saleOverride={}){
 const currentSale=phone?.sale&&typeof phone.sale==='object'?phone.sale:{};
 const sale={...currentSale,...(saleOverride&&typeof saleOverride==='object'?saleOverride:{})};
 if(!hasValue(sale.value))return{...phone,sale};
 const priorSuggested=hasValue(currentSale.suggestedValue)?number(currentSale.suggestedValue):number(phone?.expected);
 const actualValue=number(sale.value);
 return{
  ...phone,
  expected:actualValue,
  sale:{...sale,value:actualValue,suggestedValue:priorSuggested}
 };
}

export function soldSaleValueNeedsRepair(phone){
 if(!phone?.sale?.soldAt||!hasValue(phone?.sale?.value))return false;
 return number(phone.expected)!==number(phone.sale.value)||!hasValue(phone.sale.suggestedValue);
}

export function restoreSuggestedValueAfterSaleRemoval(phone){
 if(hasValue(phone?.sale?.suggestedValue))return number(phone.sale.suggestedValue);
 return number(phone?.expected);
}
