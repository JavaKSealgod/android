package com.example.yu810.new_project;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.yu810.new_project.Account_rebateFragment.OnListFragmentInteractionListener;
import com.example.yu810.new_project.dummy.DummyContent.DummyItem;

import java.util.List;

/**
 * {@link RecyclerView.Adapter} that can display a {@link DummyItem} and makes a call to the
 * specified {@link OnListFragmentInteractionListener}.
 * TODO: Replace the implementation with code for your data type.
 */
public class MyAccountrebateRecyclerViewAdapter extends RecyclerView.Adapter<MyAccountrebateRecyclerViewAdapter.ViewHolder> {

    private final List<DummyItem> mValues;
    private final OnListFragmentInteractionListener mListener;

    public MyAccountrebateRecyclerViewAdapter(List<DummyItem> items, OnListFragmentInteractionListener listener) {
        mValues = items;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fragment_accountrebate, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        holder.mItem = mValues.get(position);
        holder.mGame_name.setText(mValues.get(position).Column1);
        holder.mGame_Time.setText(mValues.get(position).Column2);
        holder.mGame_amt.setText(mValues.get(position).Column3);
        holder.game_nameText1.setText("活动编号："+  mValues.get(position).Column4 );
        holder.game_nameText2.setText("有效投注："+  mValues.get(position).Column5 );
        holder.game_nameText3.setText("总下注金额："+ mValues.get(position).Column6 );
        holder.game_nameText4.setText("下注笔数："+  mValues.get(position).Column7 );
        holder.itemChild.setVisibility(View.GONE);
        holder.mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (null != mListener) {
                    // Notify the active callbacks interface (the activity, if the
                    // fragment is attached to one) that an item has been selected.
//                    holder.itemChild.setVisibility(v.getVisibility());
                    mListener.onListFragmentInteraction(holder.mItem);
                }
                if(holder.itemChild.getVisibility()==View.VISIBLE){
                    holder.itemChild.setVisibility(v.GONE);
                }else{
                    holder.itemChild.setVisibility(v.VISIBLE);
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
        public final TextView mGame_name;
        public final TextView mGame_Time;
        public final TextView mGame_amt;
        public final TextView game_nameText1;
        public final TextView game_nameText2;
        public final TextView game_nameText3;
        public final TextView game_nameText4;
        public DummyItem mItem;
        public  final LinearLayout itemChild;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            mGame_name = (TextView) view.findViewById(R.id.game_name);
            mGame_Time = (TextView) view.findViewById(R.id.game_Time);
            mGame_amt= (TextView) view.findViewById(R.id.game_amt);
            game_nameText1= (TextView) view.findViewById(R.id.game_nameText1);
            game_nameText2= (TextView) view.findViewById(R.id.game_nameText2);
            game_nameText3= (TextView) view.findViewById(R.id.game_nameText3);
            game_nameText4= (TextView) view.findViewById(R.id.game_nameText4);
            itemChild= (LinearLayout) view.findViewById(R.id.itemChild);
        }

    }
}
