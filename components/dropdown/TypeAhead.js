// https://javascript.plainenglish.io/be-careful-of-passing-an-async-function-as-a-parameter-4f421f8e7e9d

function TypeAhead(props) {
    const { value, suggestions, placeholder, onChange, onInput, onClick } = props;

    return (
        <div>
            <input
                className="shadow appearance-none border-2 border-gray-200 rounded  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-purple-500"
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onInput={(e) => onInput(e.target.value)}
            />
            {
                (!suggestions || suggestions.length === 0) ? null :
                    <ul id="dropdown" className="absolute z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
                        {
                            suggestions.map((item, idx) => (
                                <li
                                    className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    key={item.key} onClick={() => onClick(idx)}>
                                    {item.name}
                                </li>
                            ))
                        }
                    </ul>
            }
        </div>
    )
};


export default TypeAhead;
