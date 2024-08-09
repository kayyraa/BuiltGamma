let CurrentSelection = null;
let CurrentHover = null;

let CurrentSelectedBuilding = null;

const Buildings = [
    {
        Name: "House",
        Price: 100,
        Gain: 1,
        Icon: "../images/house.svg"
    },
    {
        Name: "Factory",
        Price: 150,
        Gain: 10,
        Icon: "../images/factory.svg"
    },
    {
        Name: "Office",
        Price: 250,
        Gain: 25,
        Icon: "../images/office.svg"
    }
]

let ConstructedBuildings = []

if (localStorage.getItem("Money") === null || isNaN(localStorage.getItem("Money"))) {
    localStorage.setItem("Money", 150)
}

const MoneyType = document.createElement("div");
MoneyType.style.position = "fixed";
MoneyType.style.right = "0.6%";
MoneyType.style.width = "19.9%";
MoneyType.style.height = "6.125%";
MoneyType.style.backgroundColor = "rgba(255, 255, 255, 0.125)"
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
SelectionFrame.style.backgroundColor = "rgba(255, 255, 255, 0.125";
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
SelectionLabel.style.fontFamily = "Arial"
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
BuildingFrame.style.height = "15%";
BuildingFrame.style.display = "flex";
BuildingFrame.style.flexWrap = "nowrap";
BuildingFrame.style.alignItems = "center";
BuildingFrame.style.gap = "10px";
BuildingFrame.style.overflowX = "scroll";
document.body.appendChild(BuildingFrame);

BuildingFrame.addEventListener("wheel", function(e) {
    BuildingFrame.scrollLeft = e.deltaY / 2;
})

for (let Index = 0; Index < Buildings.length; Index++) {
    const BuildingLabel = document.createElement("span");
    BuildingLabel.innerHTML = Buildings[Index].Name;
    BuildingLabel.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
    BuildingLabel.style.aspectRatio = "1 / 1";
    BuildingLabel.style.width = "calc(100% / 4 - 10px)"
    BuildingLabel.style.height = "calc(100% / 1 - 10px)";
    BuildingLabel.style.fontSize = "24px";
    BuildingLabel.style.fontFamily = "Arial";
    BuildingLabel.style.fontWeight = "900";
    BuildingLabel.style.display = "flex";
    BuildingLabel.style.marginLeft = "2%";
    BuildingLabel.style.alignItems = "center";
    BuildingLabel.style.justifyContent = "center";
    BuildingLabel.style.textAlign = "center";
    BuildingLabel.style.cursor = "pointer";
    BuildingFrame.appendChild(BuildingLabel);

    BuildingLabel.addEventListener("click", function() {
        CurrentSelectedBuilding = Buildings[Index];
    });
    BuildingLabel.addEventListener("mouseenter", function() {
        Buildings[Index].style.backgroundColor = "rgba(255, 255, 255, 0.25)";
    });
    BuildingLabel.addEventListener("mouseleave", function() {
        Buildings[Index].style.backgroundColor = "rgba(255, 255, 255, 0.125)";
    });
}

for (let index = 0; index < 135; index++) {
    const Row = String.fromCharCode(65 + Math.floor(index / 16));
    const Column = index % 16;
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

    GridElement.addEventListener("mouseenter", function() {
        this.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
        CurrentHover = this;
    });
    GridElement.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "rgba(255, 255, 255, 0)";
        CurrentHover = null;
    });
    GridElement.addEventListener("mousedown", function(event) {
        if (event.button === 0) {
            CurrentSelection = this;
        }
    });
}

document.addEventListener('wheel', function(Event) {
    if (Event.ctrlKey) {
        Event.preventDefault();
    }
}, { passive: false });

document.addEventListener("contextmenu", function(Event) {
    Event.preventDefault();
    CurrentSelection = null;
    CurrentSelectedBuilding = null;
})

document.addEventListener("DOMContentLoaded", function() {
    const IsMobile = navigator.userAgentData.mobile;
    if (document.title === "Redirecting") {
        if (IsMobile) {
            window.location.href = "../mobile.html"
        } else {
            window.location.href = "../desktop.html"
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

    function Gainloop() {
        if (ConstructedBuildings.length > 0) {
            ConstructedBuildings.forEach(ConstructedBuilding => {
                localStorage.setItem("Money", parseInt(localStorage.getItem("Money")) + ConstructedBuilding.Gain)
            });
        }

        setTimeout(Gainloop, 125);
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
                if (!CurrentSelection.children.length > 0) {
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
    
                    Building.id = CurrentSelectedBuilding.Name
                    localStorage.setItem("Money", parseInt(localStorage.getItem("Money")) - CurrentSelectedBuilding.Price)
                    ConstructedBuildings.push(CurrentSelectedBuilding)
                    CurrentSelection.appendChild(Building);
                    CurrentSelection.dataset.ChildCount = CurrentSelection.dataset.ChildCount + 1;
                }
    
                CurrentSelectedBuilding = null;
                CurrentSelection = null;
                ClearSelection();
            }
        }

        if (localStorage.getItem("Money") !== null) {
            MoneyLabel.innerHTML = `${localStorage.getItem("Money")}$`;
        }

        setInterval(Loop, 125);
    }

    Gainloop();
    Loop();
});