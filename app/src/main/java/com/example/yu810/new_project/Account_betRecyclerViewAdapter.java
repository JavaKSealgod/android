package com.example.yu810.new_project;

import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.yu810.new_project.Account_bet_Fragment.OnListFragmentInteractionListener;
import com.example.yu810.new_project.dummy.DummyContent.DummyItem;

import java.util.List;

/**
 * {@link RecyclerView.Adapter} that can display a {@link DummyItem} and makes a call to the
 * specified {@link OnListFragmentInteractionListener}.
 * TODO: Replace the implementation with code for your data type.
 */
public class Account_betRecyclerViewAdapter extends RecyclerView.Adapter<Account_betRecyclerViewAdapter.ViewHolder> {

    private final List<DummyItem> mValues;
    private final OnListFragmentInteractionListener mListener;

    public Account_betRecyclerViewAdapter(List<DummyItem> items, OnListFragmentInteractionListener listener) {
        mValues = items;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fragment_accountbet, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        holder.mItem = mValues.get(position);

        holder.mColumn1View.setText(mValues.get(position).Column1);
        holder.mColumn2View.setText(mValues.get(position).Column2);
        holder.mColumn3View.setText(mValues.get(position).Column3);
        holder.mColumn4View.setText(mValues.get(position).Column4);
        holder.mColumn5View.setText(mValues.get(position).Column5);
        holder.mColumn6View.setText(mValues.get(position).Column6);

//        holder.mColumn1View.setBackgroundColor(0);//清空背景
        holder.mColumn4View.setTextColor(Color.parseColor("#ffcc23"));//白色
        if(mValues.get(position).Column4.indexOf("-")!=-1){
            holder.mColumn4View.setTextColor(Color.parseColor("#aa0003"));//红色
        }

        if(mValues.get(position).id.equals("999999")){
            holder.mColumn1View.setVisibility(View.INVISIBLE);
            holder.mColumn2View.setVisibility(View.INVISIBLE);
            holder.mColumn3View.setBackgroundColor(0);//清背景
            holder.mColumn3View.setTextColor(Color.parseColor("#000000"));//白色
            holder.mColumn4View.setVisibility(View.INVISIBLE);
            holder.mColumn5View.setVisibility(View.INVISIBLE);
            holder.mColumn6View.setVisibility(View.INVISIBLE);
        }

        holder.mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (null != mListener) {
                    // Notify the active callbacks interface (the activity, if the
                    // fragment is attached to one) that an item has been selected.
                    mListener.onListFragmentInteraction(holder.mItem);
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
        public final TextView mColumn1View;
        public final TextView mColumn2View;
        public final TextView mColumn3View;
        public final TextView mColumn4View;
        public final TextView mColumn5View;
        public final TextView mColumn6View;
        public DummyItem mItem;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            mColumn1View = (TextView) view.findViewById(R.id.Column1);
            mColumn2View = (TextView) view.findViewById(R.id.Column2);
            mColumn3View = (TextView) view.findViewById(R.id.Column3);
            mColumn4View = (TextView) view.findViewById(R.id.Column4);
            mColumn5View = (TextView) view.findViewById(R.id.Column5);
            mColumn6View = (TextView) view.findViewById(R.id.Column6);



        }
        @Override
        public String toString() {
            return super.toString() + " '" + mColumn5View.getText() + "'";
        }
    }


}
