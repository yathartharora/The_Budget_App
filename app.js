var budgetController = (function(){

    var calculateBudget,getBudget;

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

    var calculateTotal = function(type){

        var sum=0;
        data.allItems[type].forEach(function(current){
            sum = sum + current.value;
        });
        data.total[type] = sum;


      };

    var data = {
      allItems: {
        exp: [],
        inc: []
      },
      total: {
        exp: 0,
        inc: 0
      },
      budget: 0,
      percentage: -1
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

      calculateBudget: function(){

          calculateTotal('exp');
          calculateTotal('inc');

          data.budget = data.total.inc - data.total.exp;
          if(data.total.inc > 0){
             data.percentage = Math.round((data.total.exp/data.total.inc)*100);
          } else{
            data.percentage = -1;
          }



      },

      getBudget: function(){
          return{
            budget: data.budget,
            totalIncome: data.total.inc,
            totalExpenses: data.total.exp,
            percent: data.percentage
          }
      },
      testing: function(){
        console.log(data);
      }
    }
})();

var uIController = (function(){

     var fields,fieldsArr,displayBudget;

     var DOMstrings = {
       inputType: '.add__type',
       inputDecription: '.add__description',
       inputValue: '.add__value',
       inputButton: '.add__btn',
       incomContainer: '.income__list',
       expenseContainer: '.expenses__list',
       incomeLabel: '.budget__income--value',
       expenseLabel: '.budget__expenses--value',
       budgetLabel: '.budget__value',
       percentageLabel: '.budget__expenses--percentage'
     };

      return {

        getInput: function(){
          return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or expenses
            description: document.querySelector(DOMstrings.inputDecription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses;
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percent;
            if(obj.percent > 0){
                  document.querySelector(DOMstrings.percentageLabel).textContent = obj.percent + '%';
            }else{
              document.querySelector(DOMstrings.percentageLabel).textContent = '--';
            }
        },

        clearfields: function(){

          fields = document.querySelectorAll(DOMstrings.inputDecription + ', '+ DOMstrings.inputValue);
          fieldsArr = Array.prototype.slice.call(fields);
          fieldsArr.forEach(function(current,index,array){
              current.value = "";

          });
          fieldsArr[0].focus();
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

      var updateBudget = function(){

        budgetCntrl.calculateBudget();
        var budget = budgetCntrl.getBudget();
        uIcntrl.displayBudget(budget);
      };

      var cntrlAddItem = function(){
          var input,newItem;
          input = uIcntrl.getInput();

          if(input.description!="" && !isNaN(input.value) && input.value>0){

            newItem = budgetCntrl.addItem(input.type,input.description,input.value);
            uIcntrl.addListItem(newItem,input.type);
            uIcntrl.clearfields();
            updateBudget();

          }

      };

      return {
        init: function(){
          uIcntrl.displayBudget({
            budget: 0,
            totalIncome: 0,
            totalExpenses: 0,
            percent: -1
          });
            setUpEventListeners();

        }
      }


})(budgetController,uIController);


controller.init();
