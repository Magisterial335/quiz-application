// *****************************
// *****quizController**********
// *****************************


const quizController = (() => {

    // *************Question Constructor*************
    class Question {
        constructor(id, questionText, options, correctAnswer) {
            this.id = id;
            this.questionText = questionText;
            this.options = options;
            this.correctAnswer = correctAnswer;
        };
    }

    let questionLocalStorage = {
        setQuestionCollection: newCollection => {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: () => {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: () => {
            localStorage.removeItem('questionCollection');
        },
    };

    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    let quizProgress = {
        questionIndex: 0,
    };

    //*******PERSON CONSTRUCTOR*********
    class Person {
        constructor(id, firstname, lastname, score) {
            this.id = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.score = score;
        }
    };

    let currPersonData = {
        fullname: [],
        score: 0,
    };

    let adminFullName = ['Martynas', 'Zitkevicius'];

    const personLocalStorage = {
        setPersonData: newPersonData => {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: () => {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: () => {
            localStorage.removeItem('personData');
        },
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {
        getQuizProgress: quizProgress,
        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: (newQuestText, opts) => {
            let optionsArray = [];
            let corrAnswer;
            let questionId;
            let getStoredQuests;
            let isChecked = false;

            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }

            for (let i = 0; i < opts.length; i ++) {
                if (opts[i].value !== '') {
                    optionsArray.push(opts[i].value);
                }
                if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
                    corrAnswer = opts[i].value;
                    isChecked = true;
                }
            }


            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestText.value !== '') {
                if (optionsArray.length > 1) {
                    if (isChecked) {
                        let newQuestion = new Question(questionId, newQuestText.value, optionsArray, corrAnswer);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestText.value = '';

                        for (let x = 0; x < opts.length; x ++) {
                            opts[x].value = '';
                            opts[x].previousElementSibling.checked = false;
                        }
                        return true;
                    } else {
                        alert('You missed to check correct answer or you checked answer without value');
                        return false;
                    }
                } else {
                    alert('You must insert at least two options');
                    return false;
                }
            } else {
                alert('Please Insert Question');
                return false;
            }
        },

        checkAnswer: answer => {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer.textContent) {
                currPersonData.score ++;
                return true;
            } else {
                return false;
            }
        },

        isFinished: () => {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: () => {
            let personId;
            let personData;
            let newPerson = new Person(personId);

            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }

            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);

            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);

        },

        getCurrPersonData: currPersonData,

        getAdminFullName: adminFullName,

        getPersonLocalStorage: personLocalStorage,

    };
})();

// *****************************
// *****UIController************
// *****************************
const UIController = (() => {

    let domItems = {
        // ********Admin Panel Elements********
        adminPanelSection: document.querySelector('.admin-panel-container'),
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestionText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector('.admin-options-container'),
        insertedQuestsWrapper: document.querySelector('.inserted-questions-wrapper'),
        questUpdateBtn: document.getElementById('question-update-btn'),
        questDeleteBtn: document.getElementById('question-delete-btn'),
        questsClearBtn: document.getElementById('questions-clear-btn'),
        resultListWrapper: document.querySelector('.results-list-wrapper'),
        clearResultsBtn: document.getElementById('results-clear-btn'),
        //**********Quiz Section Elements************
        quizSection: document.querySelector('.quiz-container'),
        askedQuestText: document.getElementById('asked-question-text'),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector('progress'),
        progressPar: document.getElementById('progress'),
        instantAnswerContainer: document.querySelector('.instant-answer-container'),
        instantAnsText: document.getElementById('instant-answer-text'),
        instantAnsDiv: document.getElementById('instant-answer-wrapper'),
        emotionIcon: document.getElementById('emotion'),
        nextQuestBtn: document.getElementById('next-question-btn'),
        //***********Landing Page Elements**********
        landingPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),
        //*****************Final Result Section Elements*************
        finalResultSection: document.querySelector('.final-result-container'),
        finalScoreText: document.getElementById('final-score-text'),
    };

    return {
        getDomItems: domItems,

        addInputsDynamically: () => {
            const addInput = () => {
                let z = document.querySelectorAll('.admin-option').length;

                let inputHTML = '<div class="admin-option-wrapper"><input type= "radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            };
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },

        createQuestionList: getQuestions => {
            let questionHTML;
            let numberingArray = [];
            domItems.insertedQuestsWrapper.innerHTML = '';

            for (let i = 0; i < getQuestions.getQuestionCollection().length; i ++) {
                numberingArray.push(i + 1);

                questionHTML = '<p><span>' + numberingArray[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question- ' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questionHTML);
            }
        },

        editQuestList: (event, storageQuestList, addInpsDynFn, updateQuestListFn) => {
            let getId;
            let getStorageQuestList;
            let foundItem;
            let placeInArr;
            let optionHTML;

            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);
                getStorageQuestList = storageQuestList.getQuestionCollection();
                for (let i = 0; i < getStorageQuestList.length; i ++) {
                    if (getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];
                        placeInArr = i;
                    }
                }

                domItems.newQuestionText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';
                optionHTML = '';

                for (let x = 0; x < foundItem.options.length; x ++) {
                    optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
                }

                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questUpdateBtn.style.visibility = 'visible';
                domItems.questDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questsClearBtn.style.pointerEvents = 'none';

                addInpsDynFn;

                const backDefaultView = () => {
                    let updatedOpts = document.querySelectorAll('.admin-option');

                    domItems.newQuestionText.value = '';

                    for (let i = 0; i < updatedOpts.length; i ++) {
                        updatedOpts[i].value = '';
                        updatedOpts[i].previousElementSibling.checked = false;
                    }

                    domItems.questUpdateBtn.style.visibility = 'hidden';
                    domItems.questDeleteBtn.style.visibility = 'hidden';
                    domItems.questionInsertBtn.style.visibility = 'visible';
                    domItems.questsClearBtn.style.pointerEvents = '';

                    updateQuestListFn(storageQuestList);
                };

                const updateQuestion = () => {
                    let newOptions = [];
                    let optionEls = document.querySelectorAll('.admin-option');

                    foundItem.questionText = domItems.newQuestionText.value;

                    foundItem.correctAnswer = '';

                    for (let i = 0; i < optionEls.length; i ++) {
                        if (optionEls[i].value !== '') {
                            newOptions.push(optionEls[i].value);
                            if (optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }

                        }
                    }

                    foundItem.options = newOptions;

                    if (foundItem.questionText !== '') {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correctAnswer !== '') {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);

                                storageQuestList.setQuestionCollection(getStorageQuestList);
                                backDefaultView();

                            } else {
                                alert('You missed to check correct answer or you checked answer without value');
                            }
                        } else {
                            alert('You must insert at least two options');
                        }
                    } else {
                        alert('Please Insert Question');
                    }
                };
                domItems.questUpdateBtn.onclick = updateQuestion;

                const deleteQuestion = () => {
                    getStorageQuestList.splice(placeInArr, 1);

                    storageQuestList.setQuestionCollection(getStorageQuestList);

                    backDefaultView();
                };

                domItems.questDeleteBtn.onclick = deleteQuestion;

            }
        },

        clearQuestList: storageQuestList => {
            if (storageQuestList.getQuestionCollection() !== null) {
                if (storageQuestList.getQuestionCollection().length > 0) {
                    let conf = confirm('Warning, you will lose entire question list!');
                    if (conf) {
                        storageQuestList.removeQuestionCollection();

                        domItems.insertedQuestsWrapper.innerHTML = '';
                    }
                }
            }
        },

        displayQuestions: (storageQuestList, progress) => {
            let newOptionHTML;
            let characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];

            if (storageQuestList.getQuestionCollection().length > 0) {
                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;

                domItems.quizOptionsWrapper.innerHTML = '';

                for (let i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i ++) {
                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';

                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },

        displayProgress: (storageQuestList, progress) => {
            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;

            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressPar.textContent = progress.questionIndex + 1 + '/' + storageQuestList.getQuestionCollection().length;
        },

        newDesign: (ansResult, selectedAnswer) => {

            let twoOptions = {
                instantAnsText: ['This is a wrong answer', 'This is correct answer'],
                instAnsClass: ['red', 'green'],
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['rgba(200, 0, 0, .7)', 'rgba(0, 250, 0, .2)'],
            };

            let index = 0;

            if (ansResult) {
                index = 1;
            }

            domItems.quizOptionsWrapper.style.cssText = 'opacity: 0.6; pointer-events: none;';

            domItems.instantAnswerContainer.style.opacity = '1';

            domItems.instantAnsText.textContent = twoOptions.instantAnsText[index];

            domItems.instantAnsDiv.className = twoOptions.instAnsClass[index];

            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);

            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
        },

        resetDesign: () => {
            domItems.quizOptionsWrapper.style.cssText = '';

            domItems.instantAnswerContainer.style.opacity = '0';
        },

        getFullName: (currPerson, storageQuestList, admin) => {

            if (domItems.firstNameInput.value !== '' && domItems.lastNameInput.value !== '') {

                if ( !(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

                    if (storageQuestList.getQuestionCollection().length > 0) {

                        currPerson.fullname.push(domItems.firstNameInput.value);

                        currPerson.fullname.push(domItems.lastNameInput.value);

                        domItems.landingPageSection.style.display = 'none';

                        domItems.quizSection.style.display = 'block';
                    } else {

                        alert('Quiz is not ready, please contact admin');

                    }
                } else {

                    domItems.landingPageSection.style.display = 'none';

                    domItems.adminPanelSection.style.display = 'block';
                }
            } else {

                alert('Please enter your first name and last name!');

            }
        },

        finalResult: currPerson => {
            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            domItems.quizSection.style.display = 'none';
            domItems.finalResultSection.style.display = 'block';
        },

        addResultOnPanel: userData => {
            let resultHTML;

            domItems.resultListWrapper.innerHTML = '';

            for (let i = 0; i < userData.getPersonData().length; i ++) {
                resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].firstname + ' ' + userData.getPersonData()[i].lastname + ' - ' + userData.getPersonData()[i].score + ' Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';

                domItems.resultListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
            }
        },

        deleteResult: (event, userData) => {
            let getId, peopleArr;

            peopleArr = userData.getPersonData();

            if ('delete-result-btn_'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('_')[1]);

                for (let i = 0; i < peopleArr.length; i ++) {
                    if (peopleArr[i].id === getId) {
                        peopleArr.splice(i, 1);
                        userData.setPersonData(peopleArr);
                    }
                }
            }
        },

        clearResultList: userData => {
            let conf;

            if (userData.getPersonData() !== null) {

                if (userData.getPersonData().length > 0) {

                    conf = confirm('Warning! You will lose entire result list');

                    if (conf) {
                        userData.removePersonData();

                        domItems.resultListWrapper.innerHTML = '';
                    }
                }
            }
        },
    };

})();

// *****************************
// *****Controller**************
// *****************************


const controller = ((quizCtrl, UICtrl) => {

    let selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();

    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', () => {

        let adminOptions = document.querySelectorAll('.admin-option');

        let checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestionText, adminOptions);

        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });

    selectedDomItems.insertedQuestsWrapper.addEventListener('click', e => {
        UICtrl.editQuestList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });

    selectedDomItems.questsClearBtn.addEventListener('click', () => {
        UICtrl.clearQuestList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestions(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', e => {
        let updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for (let i = 0; i < updatedOptionsDiv.length; i ++) {
            if (e.target.className === 'choice-' + i) {
                let answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                quizCtrl.checkAnswer(answer);

                let answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {

                    selectedDomItems.nextQuestBtn.textContent = 'Finish';

                }

                const nextQuestion = (questData, progress) => {

                    if (quizCtrl.isFinished()) {

                        //Finish Quiz
                        quizCtrl.addPerson();

                        UICtrl.finalResult(quizCtrl.getCurrPersonData);

                    } else {

                        UICtrl.resetDesign();

                        quizCtrl.getQuizProgress.questionIndex ++;

                        UICtrl.displayQuestions(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                    }

                };

                selectedDomItems.nextQuestBtn.onclick = () => {

                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                };
            }
        }
    });

    selectedDomItems.startQuizBtn.addEventListener('click', () => {

        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);

    });

    selectedDomItems.lastNameInput.addEventListener('focus', () => {
        selectedDomItems.lastNameInput.addEventListener('keypress', e => {
            if (e.keyCode === 13) {

                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);

            }
        });
    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

    selectedDomItems.resultListWrapper.addEventListener('click', e => {
        UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
        UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
    });

    selectedDomItems.clearResultsBtn.addEventListener('click', () => {
        UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
    });

})(quizController, UIController);
