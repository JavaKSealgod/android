package com.example.yu810.new_project;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v7.widget.AppCompatSpinner;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.yu810.new_project.dummy.DummyContent;
import com.example.yu810.new_project.dummy.DummyContent.DummyItem;
import com.example.yu810.new_project.dummy.ReportData;

import java.util.ArrayList;
import java.util.List;
/**
 * A fragment representing a list of Items.
 * <p/>
 * Activities containing this fragment MUST implement the {@link OnListFragmentInteractionListener}
 * interface.
 */
public class Account_bet_Fragment extends Fragment {

    // TODO: Customize parameters
    private int mColumnCount = 1;

    private OnListFragmentInteractionListener mListener;

    private RecyclerView recyclerView;

    private ReportData objReportData = new ReportData();

    //api拉回数据后，重新绑定grid。
    public Handler getReportHandler = new Handler()
    {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            recyclerView.setAdapter(new Account_betRecyclerViewAdapter(DummyContent.ITEMS, mListener));
        }
    };

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public Account_bet_Fragment() {
//        objReportData.GetReportData(String.valueOf(ReportData.bet) , getReportHandler);//从api拉数据回来
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_accountbet_list, container, false);

        // Set the adapter
        if (view instanceof RecyclerView) {
            Context context = view.getContext();
            recyclerView = (RecyclerView) view;
            if (mColumnCount <= 1) {
                recyclerView.setLayoutManager(new LinearLayoutManager(context));
            } else {
                recyclerView.setLayoutManager(new GridLayoutManager(context, mColumnCount));
            }

            TextView date_in=(TextView)this.getActivity().findViewById(R.id.date_in);   //起始日期
            TextView date_in2=(TextView)this.getActivity().findViewById(R.id.date_in2); //结束日期
            AppCompatSpinner GameTypeSpinner=(AppCompatSpinner)this.getActivity().findViewById(R.id.GameTypeSpinner);//游戏类型
            AppCompatSpinner GamePCSpinner=(AppCompatSpinner)this.getActivity().findViewById(R.id.GamePCSpinner);//派彩状况

            objReportData.setStartDate(date_in.getText().toString());
            objReportData.setEndDate(date_in2.getText().toString());
            //游戏类型
            int spinner_pos = GameTypeSpinner.getSelectedItemPosition();
            String[] size_values = getResources().getStringArray(R.array.GameTypeValue);
            String strGameTypeSpinner= size_values[spinner_pos];
            objReportData.setGameType(strGameTypeSpinner);
            //派彩状况
            spinner_pos = GamePCSpinner.getSelectedItemPosition();
            size_values = getResources().getStringArray(R.array.PCvalue);
            String strDrpc= size_values[spinner_pos];
            objReportData.setDrpc(strDrpc);

            // 先清空Adapter Finally initializing our adapter
//            List<DummyItem> ITEMS = new ArrayList<DummyItem>();
//            Account_betRecyclerViewAdapter adapter = new Account_betRecyclerViewAdapter(ITEMS, mListener);
//            recyclerView.setAdapter(adapter);
            objReportData.GetReportData(String.valueOf(ReportData.bet) , getReportHandler);//从api拉数据回来
        }
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

//        if (context instanceof OnListFragmentInteractionListener) {
//            mListener = (OnListFragmentInteractionListener) context;
//        } else {
//            throw new RuntimeException(context.toString()
//                    + " must implement OnListFragmentInteractionListener");
//        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnListFragmentInteractionListener {
        // TODO: Update argument type and name
        void onListFragmentInteraction(DummyItem item);
    }
}
