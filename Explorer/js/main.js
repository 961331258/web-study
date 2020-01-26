let fileBox = document.getElementsByClassName("file-box")[0];
let fileBox2 = document.getElementsByClassName("file-box2")[0];
let fileItems = document.getElementsByClassName("file-item");
let fileItems2 = document.getElementsByClassName("file-item2");
let fileArr = Array.from(fileItems);
let fileArr2 = Array.from(fileItems2);
//排序
const nameSort = document.getElementById("name-sort");
const sizeSort = document.getElementById("size-sort");
let sizeArr = [];
let nameArr = [];
let nameArr2 = [];

// 保存 ctrl + c 的内容
// 布局1
let html = [];
let copyChild = [];
// 布局2
let html2 = [];
// 保存文件名用
let name = [];

// 保存步骤名 复制就是'c'   剪切就是'x' 粘贴就是'v'
let step = [];
let isHidden = [];

/*
* ctrlC  保存复制的dom对象  引用 浅拷贝
* ctrlX  保存对象的 isHidden 状态
* step   操作的步骤
* lastCtrlC   ctrl C 的最后一个对象
* isCtrlC     是否执行了 复制操作
* 比如 c v c v z z v z z 这样的步骤 最后的 v 是复制最后一次的 c ，如果要撤销，就得撤销  lastCtrlC
* 但是最后的 z 如果进行 isCtrlC 判断将会报错， 因为没有 step 了
* */
let detailStep = {
    ctrlC: [],
    ctrlX: [],
    step: [],
    lastCtrlC: [],
    isCtrlC: false
};

// 快捷键
document.addEventListener("keydown", (e) => {
    fileItems = document.activeElement.children[0].children[1].children[0].children;
    fileItems2 = document.activeElement.children[0].children[1].children[1].children;
    fileArr = Array.from(fileItems);
    fileArr2 = Array.from(fileItems2);
    // ctrl + a
    if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        fileArr.forEach((item) => {
            item.classList.add("file-active");
        });
        fileArr2.forEach((item) => {
            item.classList.add("file-active");
        });
    }
    // ctrl + wheel
    if (e.ctrlKey) {
        document.addEventListener("wheel", (e3) => {
            if (e3.ctrlKey) {
                let display = getComputedStyle(fileBox).display;
                // let display2 = getComputedStyle(fileBox2).display;
                if (display === "none") {
                    fileBox.style.display = "block";
                    fileBox2.style.display = "none";
                } else {
                    fileBox.style.display = "none";
                    fileBox2.style.display = "block";
                }
            }
        });
    }
    // ctrl + x
    if (e.ctrlKey && e.key === "x") {
        html = [];  // 清除 ctrl + c 内保存的内容
        html2 = [];  // 清除 ctrl + c 内保存的内容
        copyChild = [];
        isHidden = [];
        fileArr.forEach((item) => {
            item.isHidden = false;
            if (item.classList.contains("file-active")) {
                item.isHidden = true;
                item.style.display = "none";
            }
            isHidden.push(item.isHidden);
        });
        fileArr2.forEach((item) => {
            item.isHidden = false;
            if (item.classList.contains("file-active")) {
                item.isHidden = true;
                item.style.display = "none";
            }
        });
        detailStep.ctrlX.push(isHidden);
        detailStep.step.push('x');

    }
    // ctrl + v
    if (e.ctrlKey && e.key === "v") {
        // 布局1 用于ctrl + x 的 ctrl + v
        fileArr.forEach((item) => {
            if (item.isHidden) {
                item.style.display = "flex";
            }
        });
        // 布局2 用于ctrl + x 的 ctrl + v
        fileArr2.forEach((item) => {
            if (item.isHidden) {
                item.style.display = "block";
            }
        });

        // 布局1 用于 ctrl + c 的 ctrl + v
        copyChild.forEach((item, index) => {
            if (item.ccFlag === 1) {
                name[index] = item.children[0].children[1].innerHTML;   //保存一下name
                item.children[0].children[1].innerHTML += " - 副本";
            } else {
                item.children[0].children[1].innerHTML = `${name[index]} - 副本 (${item.ccFlag})`;    //保存的name 为了第二次使用
            }
            item.ccFlag++;
        });

        // 添加元素  浅拷贝 相当于引用  必须是浅拷贝对象才能移除
        fileBox.append(...copyChild);
        detailStep.isCtrlC = true;
        detailStep.step.push('v');
    }
    // ctrl + c
    if (e.ctrlKey && e.key === "c") {
        html = [];
        html2 = [];
        // 布局1 清除 ctrl + x
        fileArr.forEach((item) => {
            item.isHidden = false;
        });
        // 布局2 清除 ctrl + x
        fileArr2.forEach((item) => {
            item.isHidden = false;
        });
        // 布局1的 ctrl + c
        fileArr.forEach((item, index) => {
            if (item.classList.contains("file-active")) {
                // let nodeLi = creatNode("li", ["file-item"], );
                // let nodeFileName = creatNode("div", ["file-name"]);
                // let nodeI = creatNode("i", ["iconfont", "icon-wenjian", "file-icon"]);
                // let nodeFileDesc = creatNode("span", ["file-desc"], null, item.children[0].children[1].innerHTML);
                // let nodeFileTime = creatNode("div", ["file-time"]);
                // let nodeFileType = creatNode("div", ["file-type"], null, "文件夹")
                // let nodeFileSize = creatNode("div", ["file-size"], null, "KB");
                // let nodeNum = creatNode("span", ["num"], null , item.children[3].children[0].innerHTML);
                // nodeLi.appendChild(nodeFileName);
                // nodeFileName.appendChild(nodeI);
                // nodeFileName.appendChild(nodeFileDesc);
                // nodeLi.appendChild(nodeFileTime);
                // nodeLi.appendChild(nodeFileType);
                // nodeLi.appendChild(nodeFileSize);
                // nodeFileSize.appendChild(nodeNum);
                html.push(item);
            }
        });
        // 克隆副本
        copyChild = html.map((item) => {
            // 有原生的方法
            return item.cloneNode(true);
        });
        copyChild.forEach((item, index) => {
            item.ccFlag = 1;
        });
        detailStep.ctrlC.push(copyChild);
        detailStep.lastCtrlC = copyChild;
        detailStep.isCtrlC = true;
        detailStep.step.push("c");
    }
    // ctrl + z
    if (e.ctrlKey && e.key === "z") {
        detailStep = handleStep(detailStep);
    }
});

//  居然没用到。。
/*
* tagName  String
* nodeClass Arr
* dataId Number
* html String
* */
function creatNode(tagName, nodeClass, dataId, html) {
    let node = document.createElement(tagName);
    for (let i = 0; i < nodeClass.length; i++) {
        node.classList.add(nodeClass);
    }
    if (dataId) {
        node.dataset.id = dataId;
    }
    if (html)
        node.innerHTML = html;
    return node;
}

// c v c v c v z  z  z v
// c v z v
// c v c v v z z
// c v c z
// 处理 ctrl + z 的函数 逻辑清晰 思路明确 简直屌爆了
function handleStep(steps) {
    if (steps.step === []) {
        // 如果处理完了 就返回
        return steps;
    }
    // console.log("before", steps.ctrlC, steps.ctrlX, steps.step);
    let len = steps.step.length - 1;
    if (steps.step[len] === "v") { //如果步骤是粘贴 就往下找
        if (steps.step[len - 1] === "c") {  // 如果是 c 就撤销复制
            steps.ctrlC.pop().forEach((item) => {
                fileBox.removeChild(item);     // 移除添加的元素  需要撤销两步 因为 ctrl + c 是没有渲染的
            });
            steps.step.pop();
            steps.step.pop();
        }
        else if (steps.step[len - 1] === "x") {  // 如果是 x 就撤销粘贴  只撤销一步 因为 ctrl + x 有渲染
            let cxLen = steps.ctrlX.length;
            steps.ctrlX[cxLen - 1].forEach((item, index) => {
                if (fileItems[index].isHidden)
                    fileItems[index].style.display = "none";
            });
            steps.step.pop();
        }
        else {
            // 如果不是 x 和 c 就递归处理
            if (steps.lastCtrlC !== []
                && (steps.step.every((item) => {
                        return (item === "v");
                    }))
                && detailStep.isCtrlC) {
                steps.lastCtrlC.forEach((item)=>{
                    fileBox.removeChild(item);
                });
                steps.ctrlC.pop();
                steps.step.pop();
                detailStep.isCtrlC = false;
            } else {
                steps.step.pop();
                return handleStep(steps);
            }
        }
    } else if (steps.step[len] === "c") {
        // 如果只有 c 就递归处理
        steps.step.pop();
        steps.ctrlC.pop();
        return handleStep(steps);
    } else if (steps.step[len] === "x") {
        // 撤销剪切
        steps.ctrlX.pop().forEach((item, index) => {
            if (fileItems[index].isHidden) {
                fileItems[index].style.display = "flex";
            }
        });
        steps.step.pop();
    }
    // console.log("after", steps.ctrlC, steps.ctrlX, steps.step);
    // 最终返回 处理后的数组
    return steps;
}

let firstTime = 0;
let lastTime = 0;
let key = false;     //false 为点击 true 为移动
// clear and click and ctrl + click
document.addEventListener("click", (e) => {
    // 因为 click 和 mousedown 的冲突 导致e.target的指向会变成body，所以不能点击 body 空白处清空选择了
    // 但是可以在空白处 拖个框 清空选择
    fileItems = document.getElementsByClassName("file-item");
    fileArr = Array.from(fileItems);
    let dTop = document.documentElement.scrollTop;
    if (key) {
        fileArr.forEach((item, index) => {
            if (e.clientY + dTop >= item.offsetTop
                && e.clientY + dTop <= item.offsetTop + parseInt(getComputedStyle(item).height)) {
                if (e.ctrlKey) {
                    if (item.classList.contains("file-active")) {
                        item.classList.remove("file-active");
                    } else {
                        item.classList.add("file-active");
                    }
                } else {
                    fileArr.forEach((item2) => {
                        item2.classList.remove("file-active");
                    });
                    item.classList.add("file-active");
                }
            }
        });
        key = false;
    }
});


// name sort
let flag = 1;
nameSort.addEventListener("click", (e) => {
    const fileName = document.getElementsByClassName("file-desc");
    const fileName2 = document.getElementsByClassName("file-name2");
    const fileNameArr = Array.from(fileName);
    const fileNameArr2 = Array.from(fileName2);
    fileNameArr.forEach((item, index) => {
        nameArr[index] = item.innerHTML[0];
    });
    fileNameArr2.forEach((item, index) => {
        nameArr2[index] = item.innerHTML[0];
    });
    let len = nameArr.length;
    if (flag === 1) {
        flag = 2;
        for (let i = 0; i < len; i++) {
            for (let j = i; j < len; j++) {
                if (nameArr[j] < nameArr[i]) {
                    [nameArr[i], nameArr[j]] = [nameArr[j], nameArr[i]];
                    [fileBox.children[i].innerHTML, fileBox.children[j].innerHTML] =
                        [fileBox.children[j].innerHTML, fileBox.children[i].innerHTML];
                }
                if (nameArr2[j] < nameArr2[i]) {
                    [nameArr2[i], nameArr2[j]] = [nameArr2[j], nameArr2[i]];
                    [fileBox2.children[i].innerHTML, fileBox2.children[j].innerHTML] =
                        [fileBox2.children[j].innerHTML, fileBox2.children[i].innerHTML];
                }
            }
        }
    } else if (flag === 2) {
        flag = 1;
        for (let i = 0; i < len; i++) {
            for (let j = i; j < len; j++) {
                if (nameArr[j] > nameArr[i]) {
                    [nameArr[i], nameArr[j]] = [nameArr[j], nameArr[i]];
                    [fileBox.children[i].innerHTML, fileBox.children[j].innerHTML] =
                        [fileBox.children[j].innerHTML, fileBox.children[i].innerHTML];
                }
                if (nameArr2[j] > nameArr2[i]) {
                    [nameArr2[i], nameArr2[j]] = [nameArr2[j], nameArr2[i]];
                    [fileBox2.children[i].innerHTML, fileBox2.children[j].innerHTML] =
                        [fileBox2.children[j].innerHTML, fileBox2.children[i].innerHTML];
                }
            }
        }
    }
});

// size sort
let sizeFlag = 1;
sizeSort.addEventListener("click", () => {
    const num = document.getElementsByClassName("num");
    const numArr = Array.from(num);
    numArr.forEach((item, index) => {
        sizeArr[index] = parseInt(item.innerHTML);
    });
    let sizeLen = numArr.length;
    if (sizeFlag === 1) {
        sizeFlag = 2;
        for (let i = 0; i < sizeLen; i++) {
            for (let j = i; j < sizeLen; j++) {
                if (sizeArr[i] > sizeArr[j]) {
                    [sizeArr[i], sizeArr[j]] = [sizeArr[j], sizeArr[i]];
                    [fileBox.children[i].innerHTML, fileBox.children[j].innerHTML] =
                        [fileBox.children[j].innerHTML, fileBox.children[i].innerHTML];
                }
            }
        }
    } else if (sizeFlag === 2) {
        sizeFlag = 1;
        for (let i = 0; i < sizeLen; i++) {
            for (let j = i; j < sizeLen; j++) {
                if (sizeArr[i] < sizeArr[j]) {
                    [sizeArr[i], sizeArr[j]] = [sizeArr[j], sizeArr[i]];
                    [fileBox.children[i].innerHTML, fileBox.children[j].innerHTML] =
                        [fileBox.children[j].innerHTML, fileBox.children[i].innerHTML];
                }
            }
        }
    }
});


// 框选文件
const box = document.getElementsByClassName("box")[0];

let startX = 0;     // 开始位置 X 坐标
let startY = 0;     // 开始位置 Y 坐标
let endX = 0;       // 鼠标移动到的 X 坐标
let endY = 0;       // 鼠标移动到的 Y 坐标
let fileX = [];     // 文件左侧的 X 坐标
let fileY = [];     // 文件顶部的 Y 坐标

let boxFlag = 0;
document.addEventListener("mousedown", (e) => {
    fileItems = document.getElementsByClassName("file-item");
    fileArr = Array.from(fileItems);

    fileY = [];     // 需要初始化 !important
    firstTime = new Date().getTime();
    box.style.display = "block";
    box.style.width = `0`;
    box.style.height = `0`;
    startX = e.clientX;
    startY = e.clientY;
    box.style.left = `${startX}px`;
    box.style.top = `${startY + document.documentElement.scrollTop}px`;
    // 获取file-item 的 clientLeft 和 Top
    fileArr.forEach((item, index) => {
        fileX[index] = item.getBoundingClientRect().x;
        fileY[index] = item.getBoundingClientRect().y;
    });
    boxFlag = 1;

});

// 改变框的宽高 为当前的clientX - 创建时的clientX
// 当文件的dom对象的clientY 在 box.top 和 box.top + box.height 之间 那么添加 active 类名
// 就判断Y 考虑了滚动条，  X不判断了 ，不考虑横向滚动条的情况
document.addEventListener("mousemove", (e) => {
    e.preventDefault();
    fileItems = document.getElementsByClassName("file-item");
    let dTop = document.documentElement.scrollTop;
    let boxTop = parseInt(getComputedStyle(box).top);
    let boxHeight = parseInt(getComputedStyle(box).height);
    if (boxFlag === 1) {
        /* start 操作盒子*/
        endX = e.clientX;
        endY = e.clientY;
        if (endX > startX) {
            box.style.width = `${endX - startX}px`;
        } else {
            box.style.left = `${endX}px`;
            box.style.width = `${startX - endX}px`;
        }
        if (endY > startY) {
            box.style.height = `${endY - startY}px`;
        } else {
            box.style.top = `${endY + dTop}px`;
            box.style.height = `${startY - endY}px`;
        }
        /* end 操作盒子 */
        /* start 操作文件 */

        fileY.forEach((item, index) => {
            if (item >= (boxTop - dTop - parseInt(getComputedStyle(fileArr[index]).height))
                && item <= (boxTop - dTop + boxHeight)
            ) {
                fileItems[index].classList.add("file-active");
            } else {
                fileItems[index].classList.remove("file-active");
            }
            // }
        });
        /* end 操作文件 */
    }
});
// 清除框
document.addEventListener("mouseup", () => {
    box.style.display = "none";
    boxFlag = 0;
    lastTime = new Date().getTime();
    if ((lastTime - firstTime) < 200) {
        key = true;
    }
});
// 点击时间超过0.2秒才会被认为是 移动

