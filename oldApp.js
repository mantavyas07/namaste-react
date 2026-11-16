
// const parent = React.createElement(
//     "div",
//     { id: "parent" },
//     [
//         React.createElement(
//             "div",
//             { id: "child", key: "child" }, [
//             React.createElement("h1", { key: "child-heading-1" }, "I am an h1 tag"),
//             React.createElement("h2", { key: "child-heading-2" }, "I am an h2 tag")
//         ]),
//         React.createElement(
//             "div",
//             { id: "child2", key: "child2" }, [
//             React.createElement("h1", { key: "child2-heading-1" }, "I am an h1 tag"),
//             React.createElement("h2", { key: "child2-heading-2" }, "I am an h2 tag")
//         ])
//     ]
// )

// console.log(parent) // object or React element

// const root = ReactDOM.createRoot(document.getElementById("root"))

// root.render(parent)

// React Element
// const Title = (
//   <h1 className="heading" key="aa" tabIndex="5">
//     Namaste React using. JSX
//   </h1>
// );

// //React Component
// // Class Component - old
// // Functional Component - new
// const HeadingComponent = () => {
//   return (
//     <div id="container" key="container">
//       <Title />
//       {Title()}
//       <h1 className="heading" key="ab">
//         Namaste React Functional Component
//       </h1>
//     </div>
//   );
// };

// const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(<HeadingComponent />);
