class ApiController {
    static ProductsIdArray = new Array();
    static ProductsArray = new Array();
    constructor()
    {
        this.AddActionRecipeButton();
        this.AddActionToSubmitAllPrdButton();
    }

    RenderRecipeBoxes(obj)
    {
        return `<article class="products-box">
                    <button class="btn btn-success Plusbtn RecBtn" id="${obj.Id}"><i class="fas fa-plus"></i></button>
                    <div class='left'>
                        <img src="${obj.MainImageUrl}" alt="">
                        <div class="info">
                            <h2>${obj.Name}</h2>
                            <span>${obj.ShortDescription}</span>
                        </div>
                    </div>
                </article>`
    }


    AddActionToRecipeProductPlusBtn()
    {
        var self = this;
        var btns = document.querySelectorAll(".Plusbtn");
        for(var i = 0; i < btns.length; i++)
        {
            btns[i].addEventListener("click",function(){
                ApiController.ProductsArray.push(this.parentNode);
                self.ActionOnSelectedProduct(this.parentNode);
                (this.parentNode).parentNode.removeChild(this.parentNode);
            });
        }
    }

    AddActionToRecipeProductMinusBtn()
    {
        var self = this;
        var btns = document.querySelectorAll(".Minusbtn");
        for(var i = 0; i < btns.length; i++)
        {
            btns[i].addEventListener("click",function(){
                var indexOfElement = AdditionalServices.IndexOfElement(this.parentNode,ApiController.ProductsArray);
                ApiController.ProductsArray.splice(indexOfElement,1);
                self.ActionOnUnSelectedProduct(this.parentNode);
                (this.parentNode).parentNode.removeChild(this.parentNode);
            });
        }
    }

    ActionOnSelectedProduct(elem)
    {
        var selectedElementsSec = document.querySelector(".selected-products-art");
        elem.querySelector(".RecBtn").innerHTML = '<i class="fas fa-minus"></i>';
        elem.querySelector(".RecBtn").classList.toggle("btn-success");
        elem.querySelector(".RecBtn").classList.toggle("btn-danger");
        elem.querySelector(".RecBtn").classList.toggle("Plusbtn");
        elem.querySelector(".RecBtn").classList.toggle("Minusbtn");
        selectedElementsSec.innerHTML += `<article class="products-box">${elem.innerHTML}</article>`;
        this.AddActionToRecipeProductMinusBtn();
    }
    ActionOnUnSelectedProduct(elem)
    {
        var selectedElementsSec = document.querySelector(".products-box-sec");
        elem.querySelector(".RecBtn").innerHTML = '<i class="fas fa-plus"></i>';
        elem.querySelector(".RecBtn").classList.toggle("btn-success");
        elem.querySelector(".RecBtn").classList.toggle("btn-danger");
        elem.querySelector(".RecBtn").classList.toggle("Plusbtn");
        elem.querySelector(".RecBtn").classList.toggle("Minusbtn");
        selectedElementsSec.innerHTML += `<article class="products-box">${elem.innerHTML}</article>`;
        this.AddActionToRecipeProductPlusBtn();
    }

    AddActionToSubmitAllPrdButton()
    {
        var btn = document.querySelector("#SubmitAllProducts");
        btn.addEventListener("click",function(){
            for(var i = 0; i < ApiController.ProductsArray.length; i++)
            {
                var btnId = ApiController.ProductsArray[i].childNodes[1].id;
                ApiController.ProductsIdArray.push(btnId);
            }
            console.log(ApiController.ProductsIdArray);
        }); 
    }

    AddActionRecipeButton(){
        var btn = document.querySelector("#RecipeButton");
        btn.addEventListener("click",function(){
            var webClient = new WebClient();
            var input = document.querySelector("#RecipeInput");
            if(input.value == "" || input.value == " "){return null;}
            try {
                webClient.GetRecipeObjectsAsync(input.value);
            }
            catch(err){}
        });
    }
}

class WebClient
{
    GetRecipeObjectsAsync(KeyWord)
    {
        var controller = new ApiController();
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET",`http://europroductcms.azurewebsites.net/api/exclusiveProduct/search?query=${KeyWord}`,true);
        xmlHttpRequest.onload = function(){}
        xmlHttpRequest.onloadend = function()
        {
            var RecipeObjects = JSON.parse(xmlHttpRequest.responseText);
            var section = document.querySelector(".products-box-sec");
            section.innerHTML = "";
            for(var i = 0; i < RecipeObjects.length; i++)
            {
                section.innerHTML += controller.RenderRecipeBoxes(RecipeObjects[i]);
            }
            controller.AddActionToRecipeProductPlusBtn();
        }
        xmlHttpRequest.send();
    }

    // PostAllProductsId(array)
    // {
    //     var xmlHttpRequest = new XMLHttpRequest();
    //     xmlHttpRequest.open("POST",`http://europroductcms.azurewebsites.net/api/exclusiveProduct/search?query=${KeyWord}`,true);
    //     xmlHttpRequest.onload = function(){}
    //     xmlHttpRequest.onloadend = function(){ console.log(array); }
    //     xmlHttpRequest.send(JSON.stringify(array));
    // }
}

class AdditionalServices
{
    static IndexOfElement(element,array)
    {
        for(var i = 0; i < array.length;i++)
        {
            if(element == array[i])
            {
                return i;
            }
        }

        return -1;
    }
}


var apiController = new ApiController();