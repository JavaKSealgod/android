package com.example.yu810.new_project;

import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.yu810.new_project.Account_deposit_Fragment.OnListFragmentInteractionListener;
import com.example.yu810.new_project.dummy.DummyContent.DummyItem;

import java.util.List;

/**
 * {@link RecyclerView.Adapter} that can display a {@link DummyItem} and makes a call to the
 * specified {@link OnListFragmentInteractionListener}.
 * TODO: Replace the implementation with code for your data type.
 */
public class Account_deposit_RecyclerViewAdapter extends RecyclerView.Adapter<Account_deposit_RecyclerViewAdapter.ViewHolder> {

    private final List<DummyItem> mValues;
    private final OnListFragmentInteractionListener mListener;

    public Account_deposit_RecyclerViewAdapter(List<DummyItem> items, OnListFragmentInteractionListener listener) {
        mValues = items;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fragment_account_deposit, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        holder.mItem = mValues.get(position);
        holder.mdepositColumn1.setText(mValues.get(position).Column1);
        holder.mdepositColumn2.setText(mValues.get(position).Column2);
        holder.mdepositColumn3.setText(mValues.get(position).Column3);
        String StrState = mValues.get(position).Column4;
        holder.mdepositColumn4.setText(FrmartState(StrState));
        holder.mdepositColumn4.setTextColor(Color.parseColor("#ffffff"));//白色
        if(StrState.equals("1")){
            holder.mdepositColumn4.setTextColor(Color.parseColor("#aa0003"));//红色
        }

        holder.mdepositColumn5.setText(mValues.get(position).Column5);
        holder.mdepositColumn6.setText(mValues.get(position).Column6);
        holder.mdepositColumn7.setText(mValues.get(position).Column7);
        holder.mdepositColumn8.setText(mValues.get(position).Column8);
        holder.mdepositColumn9.setText(mValues.get(position).Column9);
        holder.mdepositColumn10.setText(mValues.get(position).Column10);
        holder.mdepositColumn11.setText(mValues.get(position).Column11);
        holder.mdepositColumn12.setText(mValues.get(position).Column12);
        holder.mdepositColumn13.setText(mValues.get(position).Column13);
        holder.mdepositColumn14.setText(mValues.get(position).Column14);
        holder.mdepositColumn15.setText(mValues.get(position).Column15);
        holder.mdepositColumn16.setText(mValues.get(position).Column16);
        holder.mdepositColumn17.setText(mValues.get(position).Column17);
        holder.mdepositColumn18.setText(mValues.get(position).Column18);
        holder.mdepositColumn19.setText(mValues.get(position).Column19);
        holder.mdepositColumn20.setText(mValues.get(position).Column20);
        holder.mdepositColumn21.setText(mValues.get(position).Column21);
        holder.mdepositColumn22.setText(mValues.get(position).Column22);


        holder.itemdepositChild.setVisibility(View.GONE);
        holder.mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (null != mListener) {
                    // Notify the active callbacks interface (the activity, if the
                    // fragment is attached to one) that an item has been selected.
                    mListener.onListFragmentInteraction(holder.mItem);
                }
                if(holder.itemdepositChild.getVisibility()==View.VISIBLE){
                    holder.itemdepositChild.setVisibility(v.GONE);
                }else{
                    holder.itemdepositChild.setVisibility(v.VISIBLE);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return mValues.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        public final View mView;
        public final TextView mdepositColumn1;
        public final TextView mdepositColumn2;
        public final TextView mdepositColumn3;
        public final TextView mdepositColumn4;
        public final LinearLayout itemdepositChild;
        public DummyItem mItem;
        public final TextView mdepositColumn5;
        public final TextView mdepositColumn6;
        public final TextView mdepositColumn7;
        public final TextView mdepositColumn8;
        public final TextView mdepositColumn9;
        public final TextView mdepositColumn10;
        public final TextView mdepositColumn11;
        public final TextView mdepositColumn12;
        public final TextView mdepositColumn13;
        public final TextView mdepositColumn14;
        public final TextView mdepositColumn15;
        public final TextView mdepositColumn16;
        public final TextView mdepositColumn17;
        public final TextView mdepositColumn18;
        public final TextView mdepositColumn19;
        public final TextView mdepositColumn20;
        public final TextView mdepositColumn21;
        public final TextView mdepositColumn22;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            mdepositColumn1 = (TextView) view.findViewById(R.id.depositColumn1);
            mdepositColumn2 = (TextView) view.findViewById(R.id.depositColumn2);
            mdepositColumn3 = (TextView) view.findViewById(R.id.depositColumn3);
            mdepositColumn4 = (TextView) view.findViewById(R.id.depositColumn4);
            mdepositColumn5 = (TextView) view.findViewById(R.id.depositColumn5);
            mdepositColumn6 = (TextView) view.findViewById(R.id.depositColumn6);
            mdepositColumn7 = (TextView) view.findViewById(R.id.depositColumn7);
            mdepositColumn8 = (TextView) view.findViewById(R.id.depositColumn8);
            mdepositColumn9 = (TextView) view.findViewById(R.id.depositColumn9);
            mdepositColumn10 = (TextView) view.findViewById(R.id.depositColumn10);
            mdepositColumn11 = (TextView) view.findViewById(R.id.depositColumn11);
            mdepositColumn12 = (TextView) view.findViewById(R.id.depositColumn12);
            mdepositColumn13 = (TextView) view.findViewById(R.id.depositColumn13);
            mdepositColumn14 = (TextView) view.findViewById(R.id.depositColumn14);
            mdepositColumn15 = (TextView) view.findViewById(R.id.depositColumn15);
            mdepositColumn16 = (TextView) view.findViewById(R.id.depositColumn16);
            mdepositColumn17 = (TextView) view.findViewById(R.id.depositColumn17);
            mdepositColumn18 = (TextView) view.findViewById(R.id.depositColumn18);
            mdepositColumn19 = (TextView) view.findViewById(R.id.depositColumn19);
            mdepositColumn20 = (TextView) view.findViewById(R.id.depositColumn20);
            mdepositColumn21 = (TextView) view.findViewById(R.id.depositColumn21);
            mdepositColumn22 = (TextView) view.findViewById(R.id.depositColumn22);

            itemdepositChild = (LinearLayout) view.findViewById(R.id.itemdepositChild);


        }

        @Override
        public String toString() {
            return super.toString() + " '" + mdepositColumn1.getText() + "'";
        }
    }
    private String  FrmartState(String objValue){
        String returnValue="";
        switch (objValue){
            case "1":
                returnValue="交易终止";
                break;
            case "2":
                returnValue="交易处理中";
                break;
            case "4":
                returnValue="交易成功";
                break;
            case "5":
                returnValue="已受理";
                break;
            default:
                break;
        }
        return returnValue;
    }
}
