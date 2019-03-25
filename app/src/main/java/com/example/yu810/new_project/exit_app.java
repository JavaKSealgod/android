package com.example.yu810.new_project;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

public class exit_app extends AppCompatActivity {

    Button bt1,bt2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_exit_app);

        bt1 = (Button)findViewById(R.id.exit_yes);
        bt2 = (Button)findViewById(R.id.exit_no);
        bt1.setOnClickListener(exit1_yes);
        bt2.setOnClickListener(exit1_no);
    }

    View.OnClickListener exit1_yes = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
                //關閉activity
                Intent intent = new Intent(Intent.ACTION_MAIN);
                intent.addCategory(Intent.CATEGORY_HOME);
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                android.os.Process.killProcess(android.os.Process.myPid());

            Toast.makeText(exit_app.this,"asdf",Toast.LENGTH_LONG).show();
        }
    };
    View.OnClickListener exit1_no = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            finish();
        }
    };

}
