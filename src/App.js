import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Kaleab",
    image: "image/kaleab.jpg",
    balance: -7,
  },
  {
    id: 933372,
    name: "Ayana",
    image: "image/ayana.jpg",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [isSelected, setIsSelected] = useState(null);

  function FriendAdder(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSelect(friend) {
    //setIsSelected(friend);
    setIsSelected((select) => (select?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function onSubmit(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === isSelected.id
          ? { ...friend, balance: friend.balance + value }
          : { ...friend }
      )
    );

    setIsSelected(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          handleSelect={handleSelect}
          selectedFriend={isSelected}
        />

        {showAddFriend && <AddFriend FriendAdder={FriendAdder} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {isSelected && <SplitBill friend={isSelected} onSubmit={onSubmit} />}
    </div>
  );
}

function FriendList({ friends, handleSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          handleSelect={handleSelect}
          key={friend.id}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelect, selectedFriend }) {
  const selected = selectedFriend?.id === friend.id;
  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {friend.balance} birr
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} ows you {friend.balance} birr
        </p>
      )}

      <Button onClick={() => handleSelect(friend)}>
        {selected ? "close" : "select"}
      </Button>
    </li>
  );
}

function AddFriend({ FriendAdder }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function NewFriend(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    FriendAdder(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={NewFriend}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📸 Image Url</label>
      <input
        type="text"
        value={image}
        setImage={(e) => setImage(e.target.value)}
      />

      <Button>ADD</Button>
    </form>
  );
}

function SplitBill({ friend, onSubmit }) {
  const [bill, setBill] = useState("");
  const [user, setUser] = useState("");
  const [paidUser, setPaidUser] = useState("user");

  const friendExpense = bill ? bill - user : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !user) return;

    const value = paidUser === "user" ? friendExpense : -user;

    onSubmit(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split A bill with {friend.name}</h2>
      <label>💰 bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🤵 your expense</label>
      <input
        type="text"
        value={user}
        onChange={(e) =>
          setUser(Number(e.target.value) > bill ? user : Number(e.target.value))
        }
      />

      <label>👬 {friend.name}'s expense</label>
      <input type="text" value={friendExpense} disabled />

      <label>🤑 who's paying the bill</label>
      <select
        value={paidUser}
        onChange={(e) => setPaidUser(Number(e.target.value))}
      >
        <option value="user">you</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>split bill</Button>
    </form>
  );
}
