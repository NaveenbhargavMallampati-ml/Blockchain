class FoodApp:
    items = {
        "Pizza": 150,
        "Burger": 100,
        "Coke":50,
        "Brownies":60
    }
    charges = {
        "PH": 30,
        "SD":50,
        "NC":20,
        "NDC":20
    }
    gst = 5
    def __init__(self) -> None:
      pass
    def returnBill(self,inputs):
        items1 = inputs["items"]
        total = 0
        for i in items1:
            total = total+FoodApp.items[i]
        total = total + (total *(0.05))
        flag = 0
        if(inputs["Special Day"] == 'Yes'):
            total += 50
            flag = 1
        if(inputs["Peak Hour"] == 'Yes'):
            total += 30
            flag = 1
        if(inputs["Night Order"] == 'Yes'):
            total += 20
            flag = 1
        if(flag == 0):
            total = total + 20
        out = "Total Bill:" + str(total)
        print(out)
        return total
        
        
food = FoodApp()
food.returnBill({"items":["Burger","Coke"],"Special Day":"Yes","Peak Hour":"No","Night Order":"Yes"})
