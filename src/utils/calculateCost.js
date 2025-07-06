export const calculateDeliveryCost = (type, weight, isSameDistrict) => {
  let baseCost = 0;
  let extraCost = 0;
  let breakdown = "";

  if (type === "document") {
    baseCost = isSameDistrict ? 60 : 80;
    breakdown = `Document delivery ${isSameDistrict ? "within" : "outside"} the district.`;
  } else {
    if (weight <= 3) {
      baseCost = isSameDistrict ? 110 : 150;
      breakdown = `Non-document up to 3kg ${isSameDistrict ? "within" : "outside"} the district.`;
    } else {
      const extraKg = weight - 3;
      const perKgCharge = extraKg * 40;
      const districtExtra = isSameDistrict ? 0 : 40;
      baseCost = isSameDistrict ? 110 : 150;
      extraCost = perKgCharge + districtExtra;

      breakdown = `
        Non-document over 3kg ${isSameDistrict ? "within" : "outside"} the district.<br/>
        Extra charge: ৳40 x ${extraKg.toFixed(1)}kg = ৳${perKgCharge}<br/>
        ${districtExtra ? "+ ৳40 extra for outside district delivery" : ""}
      `;
    }
  }

  return {
    baseCost,
    extraCost,
    totalCost: baseCost + extraCost,
    breakdown,
  };
};
