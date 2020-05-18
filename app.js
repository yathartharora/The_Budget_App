var budgetController = (function(){

    var Expense = function(id,description,value){
            this.id = id;
            this.description = description;
            this.value = value;
    };


    var Income = function(id,description,value){
            this.id = id;
            this.description = description;
            this.value = value;
    };


    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      total: {
        exp: 0,
        inc: 0
      }
    };

    return {

      addItem: function(type,des,val) {

          var newItem;
          if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          }else{
            ID = 0;
          }


          if(type==='exp'){
            newItem = new Expense(ID,des,val);
          } else if(type==='inc'){
            newItem = new Income(ID,des,val);
          }
          data.allItems[type].push(newItem);
          return newItem;
      },
      testing: function(){
        console.log(data);
      }
    }
})();

var uIController = (function(){

     var DOMstrings = {
       inputType: '.add__type',
       inputDecription: '.add__description',
       inputValue: '.add__value',
       inputButton: '.add__btn',
       incomContainer: '.income__list',
       expenseContainer: '.expenses__list',
     };

      return {

        getInput: function(){
          return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or expenses
            description: document.querySelector(DOMstrings.inputDecription).value,
            value: document.querySelector(DOMstrings.inputValue).value
          };
        },

        addListItem: function(obj,type){
          var html,newhtml;
          if(type==='inc'){
            element = DOMstrings.incomContainer;
            html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          } else if(type==='exp') {
            element = DOMstrings.expenseContainer;
            html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
          }

          newhtml = html.replace('%id%',obj.id);
          newhtml = newhtml.replace('%description%',obj.description);
          newhtml = newhtml.replace('%value%',obj.value);

          document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);



        },

        getDOMstrings:function(){
          return DOMstrings;
        }
      }

})();


var controller = (function(budgetCntrl,uIcntrl){

      var setUpEventListeners = function() {
        var DOM = uIcntrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click',cntrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13){
              cntrlAddItem();
            }
        });

      }

      var cntrlAddItem = function(){

          var input,newItem;
          input = uIcntrl.getInput();

          newItem = budgetCntrl.addItem(input.type,input.description,input.value);

          uIcntrl.addListItem(newItem,input.type);
      };

      return {
        init: function(){
            setUpEventListeners();

        }
      }


})(budgetController,uIController);


controller.init();
