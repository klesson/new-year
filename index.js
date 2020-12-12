const firebaseConfig = {
    apiKey: "AIzaSyDBuyioqSGkWua9yf5Erd_JzplV1Y24_Uw",
    authDomain: "klessontodo.firebaseapp.com",
    databaseURL: "https://klessontodo-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "klessontodo",
    storageBucket: "klessontodo.appspot.com",
    messagingSenderId: "464682819379",
    appId: "1:464682819379:web:0b08f6cc295e69ba2fe846"
};

var list = document.getElementById('list');
var text = document.getElementById('text');
var button = document.getElementById('submit');
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var collection = firebase.firestore().collection('list');

function addItem(value, id, animation, canRemove) {
    const item = document.createElement('li');
    const itemText = document.createElement('span');
    itemText.textContent = value;
    item.appendChild(itemText);
    if (canRemove) {
        const itemClose = document.createElement('span');
        itemClose.textContent = 'x';
        itemClose.setAttribute('index', id);
        itemClose.setAttribute('title', 'Удалить сообщение');
        itemClose.addEventListener('click', remove);
        item.appendChild(itemClose);
    }
    if (animation) {
        item.classList.add(animation);
        item.classList.add('animate__animated');
    }
    list.prepend(item);
}

collection.orderBy('time').get().then(snapshot => {
    snapshot.forEach(doc => {
        addItem(doc.data().title, doc.id, 'animate__fadeIn');
    });
});

function add(event) {
    event.preventDefault();
    if (text.value) {
        collection.add({title: text.value, time: Date.now()}).then(res => {
            addItem(text.value, res.id, 'animate__fadeInDown', true);
            text.value = '';
            button.classList.add('animate__animated', 'animate__bounce');
            button.addEventListener('animationend', () => {
                button.classList.remove('animate__animated');
                button.classList.remove('animate__bounce');
            });
        });
    }
}

function remove(event) {
    var index = event.target.getAttribute('index')
    var li = event.target.parentElement;
    //li.classList.remove('animate__fadeInDown');
    li.classList.add('animate__fadeOutLeft');
    setTimeout(() => {
        li.remove();
    }, 700);
    collection.doc(index).delete();
}