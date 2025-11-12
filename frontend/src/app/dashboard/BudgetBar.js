import ProgressBar from "@ramonak/react-progress-bar";

export const BudgetBar = ({ category, amountSpent, budgetAmount, onEdit, onDelete }) => {
  // show the budget bar at 100% at most, even if spent exceeds budget
  const fillPercentage = Math.min((amountSpent / budgetAmount) * 100, 100);
  const numericPercentage = ((amountSpent / budgetAmount) * 100).toFixed(2);

  return (
    <div className="bg-white hover:bg-[#f4fbf2] rounded-2xl shadow-md p-6 max-w-lg mx-auto space-y-6">

    <div className="flex flex-col gap-1">

      {/* category name and spent/budget */}
      <div className="flex justify-between text-sm text-gray-700">
        <span className="bg-[#bcecac]  px-2 py-1 rounded-lg"> 
          {category}
        </span>
        <span>
          ${amountSpent} / <span className=" text-sm text-pink-500 font-semibold">${budgetAmount}</span>
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar
        completed={Number(fillPercentage.toFixed(2))}
        bgColor={amountSpent > budgetAmount ? "#ef4444" : "#9bc5dd"} // red if over budget limit
        baseBgColor="#e2e8f0"
        height="12px"
        isLabelVisible={false} // hide text inside bar
        borderRadius="8px"
        animateOnRender
      />
       
    <div className="flex justify-between items-center">
      {/* percentage of budget used */}
      <div className="flex text-s text-gray-500">
        {numericPercentage}% of budget used
      </div>

       {/* Edit/Delete Budget buttons */}
       <div className="flex justify-end gap-3 mt-1">
          <button
            onClick={() => onEdit && onEdit(category)}
            className="text-[#9BC5DD] hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete && onDelete(category)}
            className="text-[#cb8a90] hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};
