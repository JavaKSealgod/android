package com.example.yu810.new_project;

import android.graphics.Color;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.StaggeredGridLayoutManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.yu810.new_project.Account_qryrebatenowFragment.OnListFragmentInteractionListener;
import com.example.yu810.new_project.dummy.DummyContent.DummyItem;
import com.example.yu810.new_project.dummy.ReportData;

import java.util.List;

/**
 * {@link RecyclerView.Adapter} that can display a {@link DummyItem} and makes a call to the
 * specified {@link OnListFragmentInteractionListener}.
 * TODO: Replace the implementation with code for your data type.
 */
public class Account_qryrebatenowRecyclerViewAdapter extends RecyclerView.Adapter<Account_qryrebatenowRecyclerViewAdapter.ViewHolder> {

    private final List<DummyItem> mValues;
    private final OnListFragmentInteractionListener mListener;

    public Account_qryrebatenowRecyclerViewAdapter(List<DummyItem> items, OnListFragmentInteractionListener listener) {
        mValues = items;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fragment_accountqryrebatenow, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        holder.mItem = mValues.get(position);
        holder.mColumn1.setText(mValues.get(position).Column1);
        holder.mColumn2.setText(mValues.get(position).Column2);
        holder.mColumn3.setText(mValues.get(position).Column3);
        holder.mColumn4.setText(mValues.get(position).Column4);
        holder.mColumn5.setText(mValues.get(position).Column5);
        holder.mColumn6.setText(mValues.get(position).Column6);
        if(mValues.get(position).id.equals(String.valueOf(ReportData.idNodate))){
            holder.mColumn1.setVisibility(View.INVISIBLE);
            holder.mColumn2.setVisibility(View.INVISIBLE);
            holder.mColumn3.setBackgroundColor(0);//清背景
            holder.mColumn3.setTextColor(Color.parseColor("#000000"));//白色
            holder.mColumn4.setVisibility(View.GONE);
            holder.mColumn5.setVisibility(View.GONE);
            holder.mColumn6.setVisibility(View.GONE);
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
        public final TextView mColumn1;
        public final TextView mColumn2;
        public final TextView mColumn3;
        public final TextView mColumn4;
        public final TextView mColumn5;
        public final TextView mColumn6;
        public DummyItem mItem;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            mColumn1 = (TextView) view.findViewById(R.id.Column1);
            mColumn2 = (TextView) view.findViewById(R.id.Column2);
            mColumn3 = (TextView) view.findViewById(R.id.Column3);
            mColumn4 = (TextView) view.findViewById(R.id.Column4);
            mColumn5 = (TextView) view.findViewById(R.id.Column5);
            mColumn6 = (TextView) view.findViewById(R.id.Column6);
        }

        @Override
        public String toString() {
            return super.toString() + " '" + mColumn2.getText() + "'";
        }

    }

}
