let CurrentSelection = null;
let CurrentHover = null;
let CurrentSelectedBuilding = null;

let GainMultiplier = 1.25;
let PriceMultiplier = 1.5;
let StarterMoney = 500;

let GainEvery = 500;

let MapSize = window.innerWidth * 0.2145;

let Rotation = 0;
let RotationScale = 45;

const Buildings = [
    { Name: "House", Price: 100, Gain: 2, Icon: "../images/house.svg" },
    { Name: "Factory", Price: 150, Gain: 5, Icon: "../images/factory.svg" },
    { Name: "Office", Price: 250, Gain: 10, Icon: "../images/office.svg" },
    { Name: "Hotel", Price: 500, Gain: 15, Icon: "../images/hotel.svg" },
    { Name: "Bank", Price: 1000, Gain: 25, Icon: "../images/bank.svg" },
    { Name: "Warehouse", Price: 2500, Gain: 40, Icon: "../images/warehouse.svg" },
    { Name: "Hospital", Price: 10000, Gain: 80, Icon: "../images/hospital.svg" },
    { Name: "Reactor", Price: 25000, Gain: 200, Icon: "../images/reactor.svg" },
];

let ConstructedBuildings = [];
const IsMobile = navigator.userAgentData.mobile;

if (localStorage.getItem("Money") === null || isNaN(localStorage.getItem("Money"))) {
    localStorage.setItem("Money", StarterMoney);
}

const RotationCursor = document.createElement("img");
RotationCursor.style.transition = "transform 0.125s ease, opacity 0.25s ease";
RotationCursor.style.opacity = "0";
RotationCursor.style.position = "fixed";
RotationCursor.src = "../images/arrow.svg";
RotationCursor.style.width = "1%";
RotationCursor.style.height = "auto";
document.body.appendChild(RotationCursor);

const TutorialContrainter = document.createElement("div");
TutorialContrainter.style.position = "fixed";
TutorialContrainter.style.right = "0.5%";
TutorialContrainter.style.top = "85%";
TutorialContrainter.style.width = "26.5%";
TutorialContrainter.style.height = "13.5%";
TutorialContrainter.style.transition = "opacity 0.25s ease";
TutorialContrainter.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
TutorialContrainter.style.display = "flex";
TutorialContrainter.style.flexDirection = "column";
TutorialContrainter.style.justifyContent = "center";
TutorialContrainter.style.alignItems = "flex-start";
TutorialContrainter.zIndex = -9999;
TutorialContrainter.style.overflow = "hidden";
document.body.appendChild(TutorialContrainter);

const TutorialLabel = document.createElement("span");
TutorialLabel.innerHTML = "Tutorial:";
TutorialLabel.style.fontFamily = "Arial";
TutorialLabel.style.fontSize = "28px";
TutorialLabel.style.marginLeft = "3%";
TutorialLabel.style.fontWeight = "700";
TutorialContrainter.appendChild(TutorialLabel);

const TutorialTextSelect = document.createElement("p");
TutorialTextSelect.innerHTML = "Left Click: Select";
TutorialTextSelect.style.fontFamily = "Arial";
TutorialTextSelect.style.fontSize = "16px";
TutorialTextSelect.style.marginLeft = "3%";
TutorialTextSelect.style.marginTop = "0";
TutorialTextSelect.style.marginBottom = "4px";
TutorialTextSelect.style.fontWeight = "700";
TutorialContrainter.appendChild(TutorialTextSelect);

const TutorialTextDeSelect = document.createElement("p");
TutorialTextDeSelect.innerHTML = "Right Click: Deselect";
TutorialTextDeSelect.style.fontFamily = "Arial";
TutorialTextDeSelect.style.fontSize = "16px";
TutorialTextDeSelect.style.marginLeft = "3%";
TutorialTextDeSelect.style.marginTop = "0";
TutorialTextDeSelect.style.marginBottom = "0";
TutorialTextDeSelect.style.fontWeight = "700";
TutorialContrainter.appendChild(TutorialTextDeSelect);

const MoneyType = document.createElement("div");
MoneyType.style.position = "fixed";
MoneyType.style.right = "0.6%";
MoneyType.style.width = "19.9%";
MoneyType.style.height = "11%";
MoneyType.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
MoneyType.style.display = "flex";
MoneyType.style.flexDirection = "column";
MoneyType.style.justifyContent = "center";
MoneyType.style.alignItems = "center";
MoneyType.style.alignContent = "center";
MoneyType.style.zIndex = -9999;
document.body.appendChild(MoneyType);

const MoneyLabel = document.createElement("span");
MoneyLabel.style.fontSize = `${Math.min(MoneyType.width, MoneyType.height) / 0.5}px`;
MoneyLabel.style.fontFamily = "Arial";
MoneyLabel.style.fontWeight = "700";
MoneyLabel.style.transition = "font-size 0.25s ease";
MoneyLabel.innerHTML = `${StarterMoney}$`;
MoneyLabel.style.zIndex = 0;
MoneyLabel.style.display = "block";
MoneyLabel.style.textAlign = "center";
MoneyType.appendChild(MoneyLabel);

const GainTypeLabel = document.createElement("span");
GainTypeLabel.style.fontSize = `${Math.min(MoneyType.width, MoneyType.height) / 0.5}px`;
GainTypeLabel.style.fontFamily = "Arial";
GainTypeLabel.style.fontWeight = "700";
GainTypeLabel.style.transition = "font-size 0.25s ease";
GainTypeLabel.innerHTML = `0$, s`;
GainTypeLabel.style.zIndex = 0;
GainTypeLabel.style.display = "block";
GainTypeLabel.style.textAlign = "center";
MoneyType.appendChild(GainTypeLabel);

const GridType = document.createElement("grid");
document.body.appendChild(GridType);

const BuildingFrame = document.createElement("div");
BuildingFrame.style.position = "fixed";
BuildingFrame.style.top = "90%";
BuildingFrame.style.left = "23%";
BuildingFrame.style.transform = "translate(-50%, -50%)";
BuildingFrame.style.background = "rgba(255, 255, 255, 0.125)";
BuildingFrame.style.transition = "opacity 0.125s ease";
BuildingFrame.style.width = "45%";
BuildingFrame.style.height = "auto";
BuildingFrame.style.display = "flex";
BuildingFrame.style.flexWrap = "nowrap";
BuildingFrame.style.alignItems = "flex-start";
BuildingFrame.style.gap = "10px";
BuildingFrame.style.overflowX = "scroll";
document.body.appendChild(BuildingFrame);

BuildingFrame.addEventListener("wheel", function (e) {
    BuildingFrame.scrollLeft += e.deltaY;
    e.preventDefault();
});

for (let Index = 0; Index < Buildings.length; Index++) {
    Buildings[Index].Price = Buildings[Index].Price * PriceMultiplier;

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
    PriceLabel.style.fontSize = "16px";
    PriceLabel.style.fontFamily = "Arial";
    PriceLabel.style.fontWeight = "800";

    const GainLabel = document.createElement("span");

    const FormattedGain = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(Buildings[Index].Gain * GainMultiplier);

    GainLabel.innerHTML = `${FormattedGain}, ${GainEvery / 1000}s`;
    GainLabel.style.textAlign = "center";
    GainLabel.style.width = "100%";
    GainLabel.style.backgroundColor = "transparent";
    GainLabel.style.fontSize = "14px";
    GainLabel.style.fontFamily = "Arial";
    GainLabel.style.fontWeight = "600";

    BuildingContainer.appendChild(BuildingLabel);
    BuildingContainer.appendChild(GainLabel);
    BuildingContainer.appendChild(PriceLabel);
    BuildingFrame.appendChild(BuildingContainer);

    BuildingLabel.addEventListener("click", function () {
        CurrentSelectedBuilding = Buildings[Index];
    });
}

let AddedPieces = [];
for (let Index = 0; Index < MapSize; Index++) {
    const CenterIndex = Math.floor(MapSize / 16) * Index;
    const CenterRow = String.fromCharCode(65 + Math.floor(CenterIndex / 16)).toUpperCase();
    const CenterColumn = CenterIndex % 16;
    const CenterElementName = `${CenterRow}${CenterColumn}`;
    const CenterGridPiece = document.getElementById(CenterElementName);

    if (CenterGridPiece && AddedPieces.findIndex(piece => piece.id === CenterElementName) === -1) {
        const CenterPieceImage = document.createElement('img');
        CenterPieceImage.style.width = "25%";
        CenterPieceImage.style.height = "auto";
        CenterPieceImage.src = "../images/center-piece.svg";
        CenterPieceImage.style.userSelect = "none";
        CenterPieceImage.style.userSelectShadow = "none";
        CenterPieceImage.draggable = false;
        CenterGridPiece.appendChild(CenterPieceImage);

        AddedPieces.push(CenterGridPiece)
    }
}

for (let Index = 0; Index < MapSize; Index++) {
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

    GridElement.addEventListener("mouseenter", function() {
        if (AddedPieces.findIndex(piece => piece.id === this.id) === -1) {
            this.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
            CurrentHover = this;
        }
    });    
    GridElement.addEventListener("mouseleave", function() {
        this.style.backgroundColor = "rgba(255, 255, 255, 0)";
        CurrentHover = null;
    });
    GridElement.addEventListener("mousedown", function(event) {
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
                
                Array.from(CurrentHover.getElementsByTagName("div")).forEach(Building => {
                    let Comeback = parseInt(Building.dataset.Price * 0.75);
                    let CurrentMoney = parseInt(localStorage.getItem("Money"));
                    localStorage.setItem("Money", CurrentMoney + Comeback);
                });

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

document.addEventListener("mousemove", function(Event) {
    RotationCursor.style.left = `${Event.clientX + 10}px`;
    RotationCursor.style.top = `${Event.clientY + 10}px`;
})

document.addEventListener("keydown", function(Event) {
    if (Event.key.toUpperCase() === "R" && !IsMobile) {
        Rotation += RotationScale;
    }
})

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

window.onbeforeunload = function() {
    if (ConstructedBuildings.length > 0) {
        ConstructedBuildings.forEach(Building => {
            localStorage.setItem("Money", parseInt(localStorage.getItem("Money")) + Building.Price);
        });
    }
}

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
    let TotalGain = 0;
    if (ConstructedBuildings.length > 0) {
        ConstructedBuildings.forEach(Building => {
            TotalGain += Building.Gain;
            localStorage.setItem("Money", parseInt(localStorage.getItem("Money")) + (Building.Gain * GainMultiplier));
        });
    }

    GainTypeLabel.innerHTML = `${TotalGain * GainMultiplier}$, ${GainEvery / 1000}s`;

    setTimeout(() => {
        GainLoop();
    }, GainEvery);
}

function Loop() {
    if ((Rotation % 360) === 0) {
        RotationCursor.src = "../images/arrow-green.svg";
    } else if ((Rotation % 360) === 90) {
        RotationCursor.src = "../images/arrow-red.svg";
    } else if ((Rotation % 360) === 180) {
        RotationCursor.src = "../images/arrow-blue.svg";
    } else if ((Rotation % 360) === 270) {
        RotationCursor.src = "../images/arrow.svg";
    }

    RotationCursor.style.transform = `rotate(${Rotation}deg)`;

    if (CurrentSelection) {
	    if (!IsMobile) {
            RotationCursor.style.opacity = "1";
        }

        BuildingFrame.style.opacity = "1";
        ClearSelection();
        CurrentSelection.style.backgroundColor = "rgba(255, 255, 255, 0.125)";
        CurrentSelection.dataset.ChildrenCount = CurrentSelection.children.length;
    } else {
        ClearSelection();
        BuildingFrame.style.opacity = "0";
	    RotationCursor.style.opacity = "0";
    }

    if (CurrentSelectedBuilding) {
        if (parseInt(localStorage.getItem("Money")) >= CurrentSelectedBuilding.Price) {
            if (CurrentSelection !== null) {
                const Building = document.createElement("div");
                Building.style.width = "75%";
                Building.style.height = "75%";
                Building.style.border = "none";
                Building.style.transform = `rotate(${Rotation}deg)`;
                Building.dataset.Price = CurrentSelectedBuilding.Price;
                Building.id = ConstructedBuildings.length

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
        let MoneyAmount = parseFloat(localStorage.getItem("Money"));
        let Formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });

        MoneyLabel.innerHTML = Formatter.format(MoneyAmount);
    }

    setTimeout(() => {
        Loop();
    }, 125);
}

GainLoop();
Loop();