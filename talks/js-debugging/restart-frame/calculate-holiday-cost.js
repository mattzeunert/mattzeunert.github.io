function calculateHolidayCost(){
    var cost = 0;
    cost += getFlightCost();
    cost += getHotelCost();
    cost += getFoodCost();

    debugger;
    return cost;
}