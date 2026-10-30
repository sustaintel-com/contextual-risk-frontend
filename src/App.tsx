// import React from "react";
// import AppRouter from "./Layout/AppRouter";




// const App: React.FC = () => {
//   return <AppRouter />;
// };

// export default App;



import AuthInitializer from "./auth/AuthInitializer";
import AppRouter from "./Layout/AppRouter";

function App() {
    return (
        <AuthInitializer>
            <AppRouter />
        </AuthInitializer>
    );
}

export default App;