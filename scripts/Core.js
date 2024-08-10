let CurrentSelection = null;
let CurrentHover = null;
let CurrentSelectedBuilding = null;

let GainMultiplier = 0.5;

const Buildings = [
    { Name: "House", Price: 100, Gain: 2, Icon: "../images/house.svg" },
    { Name: "Factory", Price: 150, Gain: 5, Icon: "../images/factory.svg" },
    { Name: "Office", Price: 250, Gain: 10, Icon: "../images/office.svg" },
    { Name: "Hotel", Price: 500, Gain: 15, Icon: "../images/hotel.svg" },
    { Name: "Bank", Price: 1000, Gain: 25, Icon: "../images/bank.svg" },
    { Name: "Mall", Price: 1750, Gain: 40, Icon: "../images/mall.svg" }
];

let ConstructedBuildings = [];

if (localStorage.getItem("Money") === null || isNaN(localStorage.getItem("Money"))) {
    localStorage.setItem("Money", 150);
}

const TutorialContrainter = document.createElement("div");
TutorialContrainter.style.position = "fixed";
TutorialContrainter.style.right = "0.5%";
TutorialContrainter.style.top = "84%";
TutorialContrainter.style.width = "26.5%";
TutorialContrainter.style.height = "15%";
TutorialContrainter.style.transition = "opacity 0.25s ease";
TutorialContrainter.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
TutorialContrainter.zIndex = -9999;
document.body.appendChild(TutorialContrainter);

const TutorialLabel = document.createElement("span");
TutorialLabel.innerHTML = "Tutorial:";
TutorialLabel.style.fontFamily = "Arial";
TutorialLabel.style.fontSize = "28px";
TutorialLabel.style.marginLeft = "3%";
TutorialLabel.style.fontWeight = "700";
TutorialContrainter.appendChild(TutorialLabel);

const TutorialText = document.createElement("p");
TutorialText.innerHTML = "Left Click: Select / Right Click: Deselect";
TutorialText.style.fontFamily = "Arial";
TutorialText.style.fontSize = "16px";
TutorialText.style.marginLeft = "3%";
TutorialText.style.fontWeight = "700";
TutorialContrainter.appendChild(TutorialText);

const MoneyType = document.createElement("div");
MoneyType.style.position = "fixed";
MoneyType.style.right = "0.6%";
MoneyType.style.width = "19.9%";
MoneyType.style.height = "6.125%";
MoneyType.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
MoneyType.style.display = "flex";
MoneyType.style.justifyContent = "center";
MoneyType.style.alignItems = "center";
MoneyType.style.alignContent = "center";
MoneyType.zIndex = -9999;
document.body.appendChild(MoneyType);

const MoneyLabel = document.createElement("span");
MoneyLabel.style.fontSize = "24px";
MoneyLabel.style.fontFamily = "Arial";
MoneyLabel.style.fontWeight = "700";
MoneyLabel.innerHTML = "150$";
MoneyLabel.zIndex = 0;
MoneyType.appendChild(MoneyLabel);

const GridType = document.createElement("grid");
document.body.appendChild(GridType);

const SelectionFrame = document.createElement("div");
SelectionFrame.style.width = "11.5%";
SelectionFrame.style.alignContent = "center";
SelectionFrame.style.alignItems = "center";
SelectionFrame.style.height = "7%";
SelectionFrame.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
SelectionFrame.style.opacity = "0";
SelectionFrame.style.transition = "opacity 0.125s ease";
SelectionFrame.style.position = "fixed";
SelectionFrame.style.zIndex = -9999;
document.body.appendChild(SelectionFrame);

const SelectionLabel = document.createElement("span");
SelectionLabel.style.width = "75%";
SelectionLabel.style.height = "25%";
SelectionLabel.style.fontSize = "32px";
SelectionLabel.style.padding = "24px";
SelectionLabel.style.fontFamily = "Arial";
SelectionLabel.style.fontWeight = "900";
SelectionFrame.appendChild(SelectionLabel);

const BuildingFrame = document.createElement("div");
BuildingFrame.style.position = "fixed";
BuildingFrame.style.top = "91%";
BuildingFrame.style.left = "18%";
BuildingFrame.style.transform = "translate(-50%, -50%)";
BuildingFrame.style.background = "rgba(255, 255, 255, 0.125)";
BuildingFrame.style.transition = "opacity 0.125s ease";
BuildingFrame.style.width = "35%";
BuildingFrame.style.height = "auto";
BuildingFrame.style.display = "flex";
BuildingFrame.style.flexWrap = "nowrap";
BuildingFrame.style.alignItems = "flex-start";
BuildingFrame.style.gap = "10px";
BuildingFrame.style.overflowX = "scroll";
document.body.appendChild(BuildingFrame);

BuildingFrame.addEventListener("wheel", function (e) {
    BuildingFrame.scrollLeft += e.deltaY;
});

for (let Index = 0; Index < Buildings.length; Index++) {
    const BuildingContainer = document.createElement("div");
    BuildingContainer.style.display = "flex";
    BuildingContainer.style.flexDirection = "column";
    BuildingContainer.style.alignItems = "center";
    BuildingContainer.style.padding = "10px";

    const BuildingLabel = document.createElement("span");
    BuildingLabel.innerHTML = Buildings[Index].Name;
    BuildingLabel.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
    BuildingLabel.style.aspectRatio = "1 / 1";
    BuildingLabel.style.width = "100px";
    BuildingLabel.style.height = "100px";
    BuildingLabel.style.fontSize = "16px";
    BuildingLabel.style.fontFamily = "Arial";
    BuildingLabel.style.fontWeight = "900";
    BuildingLabel.style.display = "flex";
    BuildingLabel.style.alignItems = "center";
    BuildingLabel.style.justifyContent = "center";
    BuildingLabel.style.textAlign = "center";
    BuildingLabel.style.cursor = "pointer";

    const PriceLabel = document.createElement("span");
    PriceLabel.innerHTML = `${Buildings[Index].Price}$`;
    PriceLabel.style.textAlign = "center";
    PriceLabel.style.width = "100%";
    PriceLabel.style.backgroundColor = "transparent";
    PriceLabel.style.fontSize = "14px";
    PriceLabel.style.fontFamily = "Arial";
    PriceLabel.style.fontWeight = "500";

    BuildingContainer.appendChild(BuildingLabel);
    BuildingContainer.appendChild(PriceLabel);
    BuildingFrame.appendChild(BuildingContainer);

    BuildingLabel.addEventListener("click", function () {
        CurrentSelectedBuilding = Buildings[Index];
    });
}

for (let Index = 0; Index < 135; Index++) {
    const Row = String.fromCharCode(65 + Math.floor(Index / 16));
    const Column = Index % 16;
    const ElementName = `${Row}${Column}`;

    const GridElement = document.createElement("div");
    GridElement.id = ElementName;
    GridElement.dataset.ChildrenCount = 0;
    GridElement.style.display = "flex";
    GridElement.style.alignContent = "center";
    GridElement.style.alignItems = "center";
    GridElement.style.justifyContent = "center";
    GridElement.style.cursor = "pointer";
    GridType.appendChild(GridElement);

    GridElement.addEventListener("mouseenter", function () {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
        CurrentHover = this;
    });
    GridElement.addEventListener("mouseleave", function () {
        this.style.backgroundColor = "rgba(255, 255, 255, 0)";
        CurrentHover = null;
    });
    GridElement.addEventListener("mousedown", function (event) {
        TutorialContrainter.style.opacity = "0";
        setTimeout(() => {
            TutorialContrainter.remove();
        }, 250);

        if (event.button === 0 && this.children.length === 0) {
            CurrentSelection = this;
        }
    
        if (event.button === 2 && this.children.length > 0) {
            event.preventDefault();
    
            const BuildingToRemove = ConstructedBuildings.find(building => building.id === this.id);
    
            if (BuildingToRemove) {
                ConstructedBuildings = ConstructedBuildings.filter(building => building.id !== this.id);
                
                Array.from(this.getElementsByTagName("div")).forEach(element => {
                    element.remove();
                });
    
                if (CurrentHover === this) {
                    CurrentHover = null;
                }
            }
        }
    });
}

document.addEventListener('wheel', function (Event) {
    if (Event.ctrlKey) {
        Event.preventDefault();
    }
}, { passive: false });

document.addEventListener("contextmenu", function (Event) {
    Event.preventDefault();
    CurrentSelection = null;
    CurrentSelectedBuilding = null;
})

const IsMobile = navigator.userAgentData.mobile;

if (document.title === "Redirecting") {
    if (IsMobile) {
        window.location.href = "../mobile.html";
    } else {
        window.location.href = "../desktop.html";
    }
}

function ClearSelection() {
    const GridElements = Array.from(GridType.getElementsByTagName("div"));
    GridElements.forEach(GridElement => {
        if (GridElement !== CurrentSelection && GridElement !== CurrentHover) {
            GridElement.style.backgroundColor = "rgba(255, 255, 255, 0)";
        }
    });

    const BuildingElements = Array.from(BuildingFrame.getElementsByTagName("span"));
    BuildingElements.forEach(BuildingElement => {
        if (BuildingElement !== CurrentSelectedBuilding) {
            BuildingElement.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
        }
    });
}

function GainLoop() {
    if (ConstructedBuildings.length > 0) {
        ConstructedBuildings.forEach(building => {
            localStorage.setItem("Money", parseInt(localStorage.getItem("Money")) + (building.Gain * GainMultiplier));
        });
    }

    setTimeout(() => {
        GainLoop();
    }, 500);
}

function Loop() {
    if (CurrentSelection) {
        SelectionFrame.style.opacity = "1";
        BuildingFrame.style.opacity = "1";
        ClearSelection();
        SelectionLabel.innerHTML = CurrentSelection.id;
        CurrentSelection.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
        CurrentSelection.dataset.ChildrenCount = CurrentSelection.children.length;
        SelectionLabel.innerHTML = `${CurrentSelection.id} - ${CurrentSelection.dataset.ChildrenCount}`;
    } else {
        ClearSelection();
        SelectionFrame.style.opacity = "0";
        BuildingFrame.style.opacity = "0";
    }

    if (CurrentSelectedBuilding) {
        if (parseInt(localStorage.getItem("Money")) >= CurrentSelectedBuilding.Price) {
            if (CurrentSelection !== null) {
                const Building = document.createElement("div");
                Building.style.width = "75%";
                Building.style.height = "75%";
                Building.style.border = "none";

                if (CurrentSelectedBuilding.Icon === "") {
                    Building.style.backgroundColor = "white";
                } else {
                    const Image = document.createElement("img");
                    Image.src = CurrentSelectedBuilding.Icon;
                    Image.style.width = "100%";
                    Image.style.height = "100%";
                    Image.style.aspectRatio = "1 / 1";
                    Image.style.border = "none";
                    Building.appendChild(Image);
                }

                Building.id = CurrentSelectedBuilding.Name;
                localStorage.setItem("Money", parseInt(localStorage.getItem("Money")) - CurrentSelectedBuilding.Price);
                ConstructedBuildings.push({ id: CurrentSelection.id, ...CurrentSelectedBuilding });
                CurrentSelection.appendChild(Building);
                CurrentSelection.dataset.ChildCount = parseInt(CurrentSelection.dataset.ChildCount || 0) + 1;
            }

            CurrentSelectedBuilding = null;
            CurrentSelection = null;
            ClearSelection();
        }
    }

    if (localStorage.getItem("Money") !== null) {
        MoneyLabel.innerHTML = `${localStorage.getItem("Money")}$`;
    }

    setTimeout(() => {
        Loop();
    }, 125);
}

GainLoop();
Loop();